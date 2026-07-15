import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";
import { PromptCompilerService } from "../prompt-compiler/prompt-compiler.service";
import { SystemAgentsService } from "../system-agents/system-agents.service";

import { AgentsService } from "./agents.service";

import type { Agent } from "@aucobot/database";

const mockAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: "agent-user-1",
  ownerId: "user-1",
  isSystem: false,
  presetId: "custom",
  name: "Mai Content",
  avatarUrl: null,
  bio: null,
  role: "Content creator",
  description: "Viết caption",
  tonePreset: "casual",
  toneNotes: null,
  enabledSkillGroups: ["web-search"],
  instructionsSource: {},
  instructionsCompiled: "## Identity\nMai Content",
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

const motherRow = mockAgent({
  id: "mother-1",
  ownerId: null,
  isSystem: true,
  presetId: "mother",
  name: "AucoMother",
  role: "Agent factory",
  instructionsCompiled: "## Identity\nAucoMother",
});

describe("AgentsService", () => {
  let service: AgentsService;

  const prisma = {
    agent: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    conversation: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const promptCompiler = {
    compile: jest.fn().mockReturnValue("## compiled"),
  };

  const systemAgents = {
    getMother: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AgentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: PromptCompilerService, useValue: promptCompiler },
        { provide: SystemAgentsService, useValue: systemAgents },
      ],
    }).compile();

    service = module.get(AgentsService);
    jest.clearAllMocks();
    promptCompiler.compile.mockReturnValue("## compiled");
    systemAgents.getMother.mockResolvedValue(motherRow);
  });

  describe("listForUser", () => {
    it("lists only owned non-system agents", async () => {
      prisma.agent.findMany.mockResolvedValue([mockAgent()]);

      const result = await service.listForUser("user-1");

      expect(prisma.agent.findMany).toHaveBeenCalledWith({
        where: { ownerId: "user-1", isSystem: false },
        orderBy: { updatedAt: "desc" },
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.name).toBe("Mai Content");
    });
  });

  describe("createForUser", () => {
    it("creates a user agent with compiled instructions", async () => {
      prisma.agent.create.mockResolvedValue(mockAgent());

      const result = await service.createForUser("user-1", {
        name: "Mai Content",
        role: "Content creator",
        description: "Viết caption",
        tonePreset: "casual",
        enabledSkillGroups: ["web-search"],
      });

      expect(promptCompiler.compile).toHaveBeenCalled();
      expect(prisma.agent.create).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jest asymmetric matcher
        data: expect.objectContaining({
          ownerId: "user-1",
          isSystem: false,
          presetId: "custom",
          instructionsCompiled: "## compiled",
        }),
      });
      expect(result.ownerId).toBe("user-1");
    });

    it("rejects reserved system presetIds", async () => {
      await expect(
        service.createForUser("user-1", {
          name: "Fake Mother",
          role: "Nope",
          tonePreset: "friendly",
          presetId: "mother",
          enabledSkillGroups: [],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.agent.create).not.toHaveBeenCalled();
    });
  });

  describe("getForUser", () => {
    it("returns owned agent", async () => {
      prisma.agent.findFirst.mockResolvedValue(mockAgent());

      const result = await service.getForUser("user-1", "agent-user-1");

      expect(result.id).toBe("agent-user-1");
    });

    it("throws when missing", async () => {
      prisma.agent.findFirst.mockResolvedValue(null);

      await expect(service.getForUser("user-1", "missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("ensureMotherDm", () => {
    it("returns existing Mother session", async () => {
      prisma.conversation.findFirst.mockResolvedValue({
        id: "mother-conv",
        userId: "user-1",
        type: "session",
        title: "AucoMother",
        description: "dm",
        lastMessageAt: null,
        createdAt: new Date("2026-07-01T10:00:00.000Z"),
        updatedAt: new Date("2026-07-01T10:00:00.000Z"),
      });

      const result = await service.ensureMotherDm("user-1");

      expect(result.conversation.id).toBe("mother-conv");
      expect(result.mother.presetId).toBe("mother");
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("creates Mother session when missing", async () => {
      prisma.conversation.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(
        async (callback: (tx: unknown) => Promise<unknown>) => {
          const tx = {
            conversation: {
              create: jest.fn().mockResolvedValue({
                id: "new-mother-conv",
                userId: "user-1",
                type: "session",
                title: "AucoMother",
                description: "Coach",
                lastMessageAt: null,
                createdAt: new Date("2026-07-01T10:00:00.000Z"),
                updatedAt: new Date("2026-07-01T10:00:00.000Z"),
              }),
            },
            conversationMember: {
              create: jest.fn().mockResolvedValue(undefined),
            },
          };
          return callback(tx);
        },
      );

      const result = await service.ensureMotherDm("user-1");

      expect(result.conversation.id).toBe("new-mother-conv");
      expect(systemAgents.getMother).toHaveBeenCalled();
    });
  });

  describe("ensureAgentDm", () => {
    it("creates DM for owned user agent", async () => {
      prisma.agent.findFirst.mockResolvedValue(mockAgent());
      prisma.conversation.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(
        async (callback: (tx: unknown) => Promise<unknown>) => {
          const tx = {
            conversation: {
              create: jest.fn().mockResolvedValue({
                id: "agent-dm-1",
                userId: "user-1",
                type: "session",
                title: "Mai Content",
                description: null,
                lastMessageAt: null,
                createdAt: new Date("2026-07-01T10:00:00.000Z"),
                updatedAt: new Date("2026-07-01T10:00:00.000Z"),
              }),
            },
            conversationMember: {
              create: jest.fn().mockResolvedValue(undefined),
            },
          };
          return callback(tx);
        },
      );

      const result = await service.ensureAgentDm("user-1", "agent-user-1");

      expect(result.conversation.id).toBe("agent-dm-1");
      expect(result.agent.id).toBe("agent-user-1");
    });

    it("404 when agent not owned", async () => {
      prisma.agent.findFirst.mockResolvedValue(null);

      await expect(service.ensureAgentDm("user-1", "x")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
