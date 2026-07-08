import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";

import { ConversationAccessService } from "./conversation-access.service";

import type { Conversation } from "@aucobot/database";

const mockConversation = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: "conv-1",
  userId: "user-1",
  type: "room",
  title: "Team TikTok",
  description: null,
  lastMessageAt: null,
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

describe("ConversationAccessService", () => {
  let access: ConversationAccessService;

  const prisma = {
    conversation: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConversationAccessService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    access = module.get(ConversationAccessService);
    jest.clearAllMocks();
  });

  it("returns the conversation when the user is the owner", async () => {
    prisma.conversation.findFirst.mockResolvedValue(mockConversation());

    const result = await access.assert("user-1", "conv-1");

    expect(prisma.conversation.findFirst).toHaveBeenCalledWith({
      where: { id: "conv-1", userId: "user-1" },
    });
    expect(result.id).toBe("conv-1");
  });

  it("throws when the conversation is missing or not owned by the user", async () => {
    prisma.conversation.findFirst.mockResolvedValue(null);

    await expect(access.assert("user-1", "missing")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
