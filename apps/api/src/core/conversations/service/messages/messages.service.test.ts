import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AgentResolverService } from "../../../agents/service/agent-resolver/agent-resolver.service";
import { PrismaService } from "../../../database/prisma.service";
import { FeatureFlagsService } from "../../../features/service/feature-flags/feature-flags.service";
import { LLM_COMPLETION_PORT } from "../../../plugins/llm-completion.port";
import { ConversationAccessService } from "../conversation-access/conversation-access.service";

import { MessagesService } from "./messages.service";

import type { Conversation, Message } from "@aucobot/database";

const mockConversation = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: "conv-1",
  userId: "user-1",
  type: "session",
  title: "Test",
  description: null,
  lastMessageAt: null,
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

const mockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: "msg-1",
  conversationId: "conv-1",
  ownerId: "user-1",
  senderType: "user",
  agentId: null,
  content: "Hello",
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

describe("MessagesService", () => {
  let service: MessagesService;

  const prisma = {
    message: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    conversation: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const access = {
    assert: jest.fn(),
  };

  const agentResolver = {
    resolveForSession: jest.fn(),
  };

  const featureFlags = {
    assertEnabled: jest.fn(),
  };

  const llmCompletion = {
    complete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConversationAccessService, useValue: access },
        { provide: AgentResolverService, useValue: agentResolver },
        { provide: FeatureFlagsService, useValue: featureFlags },
        { provide: LLM_COMPLETION_PORT, useValue: llmCompletion },
      ],
    }).compile();

    service = module.get(MessagesService);
    jest.clearAllMocks();
  });

  describe("sendMessage", () => {
    it("persists user and assistant messages for a session", async () => {
      access.assert.mockResolvedValue(mockConversation());
      agentResolver.resolveForSession.mockResolvedValue({
        id: "agent-1",
        instructionsCompiled: "You are AucoAgent",
      });
      prisma.message.findMany.mockResolvedValue([mockMessage({ content: "Hello" })]);
      prisma.message.create.mockResolvedValue(mockMessage());
      llmCompletion.complete.mockResolvedValue("Hi there!");
      prisma.$transaction.mockImplementation(
        async (callback: (tx: typeof prisma) => Promise<Message>) => {
          const tx = {
            message: {
              create: jest.fn().mockResolvedValue(
                mockMessage({
                  id: "msg-2",
                  senderType: "agent",
                  agentId: "agent-1",
                  content: "Hi there!",
                }),
              ),
            },
            conversation: {
              update: jest.fn().mockResolvedValue(undefined),
            },
          };
          return callback(tx as unknown as typeof prisma);
        },
      );

      const result = await service.sendMessage("user-1", "conv-1", {
        content: "Hello",
      });

      expect(featureFlags.assertEnabled).toHaveBeenCalledWith("ai-orchestration");
      expect(llmCompletion.complete).toHaveBeenCalledWith({
        system: "You are AucoAgent",
        messages: [{ role: "user", content: "Hello" }],
      });
      expect(result.userMessage.content).toBe("Hello");
      expect(result.assistantMessage.content).toBe("Hi there!");
    });

    it("rejects room conversations", async () => {
      access.assert.mockResolvedValue(mockConversation({ type: "room" }));

      await expect(
        service.sendMessage("user-1", "conv-1", { content: "Hello" }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws when LLM port is missing", async () => {
      const module = await Test.createTestingModule({
        providers: [
          MessagesService,
          { provide: PrismaService, useValue: prisma },
          { provide: ConversationAccessService, useValue: access },
          { provide: AgentResolverService, useValue: agentResolver },
          { provide: FeatureFlagsService, useValue: featureFlags },
        ],
      }).compile();

      const serviceWithoutLlm = module.get(MessagesService);
      access.assert.mockResolvedValue(mockConversation());
      featureFlags.assertEnabled.mockImplementation(() => undefined);

      await expect(
        serviceWithoutLlm.sendMessage("user-1", "conv-1", { content: "Hello" }),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);
    });
  });

  describe("listForConversation", () => {
    it("returns messages in ascending order", async () => {
      access.assert.mockResolvedValue(mockConversation());
      prisma.message.findMany.mockResolvedValue([
        mockMessage({ id: "msg-1" }),
        mockMessage({ id: "msg-2", senderType: "agent", content: "Reply" }),
      ]);

      const result = await service.listForConversation("user-1", "conv-1");

      expect(result.items).toHaveLength(2);
      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: "conv-1" },
        orderBy: { createdAt: "asc" },
        take: 50,
      });
    });

    it("propagates access errors", async () => {
      access.assert.mockRejectedValue(new NotFoundException());

      await expect(
        service.listForConversation("user-1", "missing"),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
