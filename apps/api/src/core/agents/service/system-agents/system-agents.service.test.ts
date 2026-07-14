import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";
import {
  AUCO_AGENT_INSTRUCTIONS,
  AUCO_AGENT_NAME,
  MOTHER_NAME,
  MOTHER_PRESET_ID,
  ORCHESTRATOR_NAME,
  ORCHESTRATOR_PRESET_ID,
  QUICK_ASSISTANT_PRESET_ID,
} from "../../agent.constants";

import { SystemAgentsService } from "./system-agents.service";

import type { Agent } from "@aucobot/database";

const baseAgentFields = {
  ownerId: null as string | null,
  avatarUrl: null as string | null,
  bio: null as string | null,
  role: "",
  description: null as string | null,
  tonePreset: "friendly",
  toneNotes: null as string | null,
  enabledSkillGroups: [] as string[],
  instructionsSource: null as unknown,
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
};

const mockAgent = (overrides: Partial<Agent> = {}): Agent =>
  ({
    id: "agent-1",
    isSystem: true,
    presetId: QUICK_ASSISTANT_PRESET_ID,
    name: AUCO_AGENT_NAME,
    instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
    ...baseAgentFields,
    ...overrides,
  }) as Agent;

describe("SystemAgentsService", () => {
  let service: SystemAgentsService;

  const prisma = {
    agent: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SystemAgentsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(SystemAgentsService);
    jest.clearAllMocks();
  });

  describe("seedQuickAssistant", () => {
    it("creates AucoAgent when missing", async () => {
      prisma.agent.findFirst.mockResolvedValue(null);
      prisma.agent.create.mockResolvedValue(mockAgent({ role: "Quick assistant" }));

      await service.seedQuickAssistant();

      expect(prisma.agent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isSystem: true,
          presetId: QUICK_ASSISTANT_PRESET_ID,
          name: AUCO_AGENT_NAME,
          instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
        }),
      });
    });

    it("updates existing system row by id", async () => {
      const existing = mockAgent({ id: "existing-qa" });
      prisma.agent.findFirst.mockResolvedValue(existing);
      prisma.agent.update.mockResolvedValue(existing);

      await service.seedQuickAssistant();

      expect(prisma.agent.update).toHaveBeenCalledWith({
        where: { id: "existing-qa" },
        data: expect.objectContaining({
          isSystem: true,
          name: AUCO_AGENT_NAME,
          ownerId: null,
        }),
      });
      expect(prisma.agent.create).not.toHaveBeenCalled();
    });
  });

  describe("getQuickAssistant", () => {
    it("returns existing agent when present", async () => {
      prisma.agent.findFirst.mockResolvedValue(mockAgent());

      const result = await service.getQuickAssistant();

      expect(result.presetId).toBe(QUICK_ASSISTANT_PRESET_ID);
      expect(prisma.agent.create).not.toHaveBeenCalled();
    });

    it("seeds when agent is missing", async () => {
      prisma.agent.findFirst.mockResolvedValue(null);
      prisma.agent.create.mockResolvedValue(mockAgent());

      const result = await service.getQuickAssistant();

      expect(result.name).toBe(AUCO_AGENT_NAME);
      expect(prisma.agent.create).toHaveBeenCalled();
    });
  });

  describe("getOrchestrator", () => {
    it("returns @Trợ Lý system agent", async () => {
      prisma.agent.findFirst.mockResolvedValue(
        mockAgent({
          id: "orch-1",
          presetId: ORCHESTRATOR_PRESET_ID,
          name: ORCHESTRATOR_NAME,
        }),
      );

      const result = await service.getOrchestrator();

      expect(result.name).toBe(ORCHESTRATOR_NAME);
      expect(prisma.agent.findFirst).toHaveBeenCalledWith({
        where: { isSystem: true, presetId: ORCHESTRATOR_PRESET_ID },
      });
    });
  });

  describe("getMother", () => {
    it("returns AucoMother system agent", async () => {
      prisma.agent.findFirst.mockResolvedValue(
        mockAgent({
          id: "mother-1",
          presetId: MOTHER_PRESET_ID,
          name: MOTHER_NAME,
        }),
      );

      const result = await service.getMother();

      expect(result.presetId).toBe(MOTHER_PRESET_ID);
      expect(result.name).toBe(MOTHER_NAME);
    });
  });

  describe("seedAllSystemAgents", () => {
    it("seeds all three system presets", async () => {
      prisma.agent.findFirst.mockResolvedValue(null);
      prisma.agent.create
        .mockResolvedValueOnce(mockAgent())
        .mockResolvedValueOnce(
          mockAgent({ presetId: ORCHESTRATOR_PRESET_ID, name: ORCHESTRATOR_NAME }),
        )
        .mockResolvedValueOnce(
          mockAgent({ presetId: MOTHER_PRESET_ID, name: MOTHER_NAME }),
        );

      await service.seedAllSystemAgents();

      expect(prisma.agent.create).toHaveBeenCalledTimes(3);
      expect(prisma.agent.create.mock.calls.map((c) => c[0].data.presetId)).toEqual([
        QUICK_ASSISTANT_PRESET_ID,
        ORCHESTRATOR_PRESET_ID,
        MOTHER_PRESET_ID,
      ]);
    });
  });
});
