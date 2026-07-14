import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { SystemAgentsService } from "../../../agents/service/system-agents/system-agents.service";
import { PrismaService } from "../../../database/prisma.service";
import { ConversationAccessService } from "../conversation-access/conversation-access.service";

import { ConversationsService } from "./conversations.service";

import type { Conversation } from "@aucobot/database";

const mockConversation = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: "conv-1",
  userId: "user-1",
  type: "room",
  title: "Team TikTok",
  description: "Campaign Q1",
  lastMessageAt: null,
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

describe("ConversationsService", () => {
  let service: ConversationsService;

  const prisma = {
    conversation: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const systemAgents = {
    getQuickAssistant: jest.fn(),
    getOrchestrator: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConversationsService,
        ConversationAccessService,
        { provide: PrismaService, useValue: prisma },
        { provide: SystemAgentsService, useValue: systemAgents },
      ],
    }).compile();

    service = module.get(ConversationsService);
    jest.clearAllMocks();
  });

  describe("listForUser", () => {
    it("returns conversations for the user ordered by updatedAt", async () => {
      prisma.conversation.findMany.mockResolvedValue([
        mockConversation({ id: "a" }),
        mockConversation({ id: "b", type: "session", title: "Draft captions" }),
      ]);

      const result = await service.listForUser("user-1");

      expect(prisma.conversation.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { updatedAt: "desc" },
      });
      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.type).toBe("room");
      expect(result.items[1]?.type).toBe("session");
    });
  });

  describe("createForUser", () => {
    it("creates a room and auto-binds @Trợ Lý", async () => {
      systemAgents.getOrchestrator.mockResolvedValue({ id: "orch-1" });
      const memberCreate = jest.fn().mockResolvedValue(undefined);
      prisma.$transaction.mockImplementation(
        async (callback: (tx: unknown) => Promise<Conversation>) => {
          const tx = {
            conversation: {
              create: jest.fn().mockResolvedValue(mockConversation()),
            },
            conversationMember: {
              create: memberCreate,
            },
          };
          return callback(tx);
        },
      );

      const result = await service.createForUser("user-1", {
        type: "room",
        title: "Team TikTok",
        description: "Campaign Q1",
      });

      expect(systemAgents.getOrchestrator).toHaveBeenCalled();
      expect(memberCreate).toHaveBeenCalledWith({
        data: {
          conversationId: "conv-1",
          agentId: "orch-1",
          isDefault: true,
        },
      });
      expect(result.title).toBe("Team TikTok");
      expect(result.description).toBe("Campaign Q1");
    });

    it("stores null description when omitted for session via transaction", async () => {
      systemAgents.getQuickAssistant.mockResolvedValue({ id: "agent-1" });
      prisma.$transaction.mockImplementation(
        async (callback: (tx: typeof prisma) => Promise<Conversation>) => {
          const tx = {
            conversation: {
              create: jest
                .fn()
                .mockResolvedValue(
                  mockConversation({ type: "session", description: null }),
                ),
            },
            conversationMember: {
              create: jest.fn().mockResolvedValue(undefined),
            },
          };
          return callback(tx as unknown as typeof prisma);
        },
      );

      await service.createForUser("user-1", {
        type: "session",
        title: "Soạn caption Tết",
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it("auto-binds AucoAgent when creating a session", async () => {
      systemAgents.getQuickAssistant.mockResolvedValue({ id: "agent-1" });
      prisma.$transaction.mockImplementation(
        async (callback: (tx: typeof prisma) => Promise<Conversation>) => {
          const tx = {
            conversation: {
              create: jest
                .fn()
                .mockResolvedValue(
                  mockConversation({ type: "session", title: "Scratch" }),
                ),
            },
            conversationMember: {
              create: jest.fn().mockResolvedValue(undefined),
            },
          };
          return callback(tx as unknown as typeof prisma);
        },
      );

      await service.createForUser("user-1", {
        type: "session",
        title: "Scratch",
      });

      expect(systemAgents.getQuickAssistant).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("getForUser", () => {
    it("returns conversation when owned by user", async () => {
      prisma.conversation.findFirst.mockResolvedValue(mockConversation());

      const result = await service.getForUser("user-1", "conv-1");

      expect(result.id).toBe("conv-1");
    });

    it("throws when conversation is missing or not owned", async () => {
      prisma.conversation.findFirst.mockResolvedValue(null);

      await expect(service.getForUser("user-1", "missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
