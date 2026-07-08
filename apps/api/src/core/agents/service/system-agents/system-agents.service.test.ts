import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";
import {
  AUCO_AGENT_INSTRUCTIONS,
  AUCO_AGENT_NAME,
  QUICK_ASSISTANT_PRESET_ID,
} from "../../agent.constants";

import { SystemAgentsService } from "./system-agents.service";

import type { Agent } from "@aucobot/database";

const mockAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: "agent-1",
  ownerId: null,
  isSystem: true,
  presetId: QUICK_ASSISTANT_PRESET_ID,
  name: AUCO_AGENT_NAME,
  instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
  createdAt: new Date("2026-07-01T10:00:00.000Z"),
  updatedAt: new Date("2026-07-01T10:00:00.000Z"),
  ...overrides,
});

describe("SystemAgentsService", () => {
  let service: SystemAgentsService;

  const prisma = {
    agent: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
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
    it("upserts AucoAgent by preset id", async () => {
      prisma.agent.upsert.mockResolvedValue(mockAgent());

      await service.seedQuickAssistant();

      expect(prisma.agent.upsert).toHaveBeenCalledWith({
        where: { presetId: QUICK_ASSISTANT_PRESET_ID },
        create: {
          isSystem: true,
          presetId: QUICK_ASSISTANT_PRESET_ID,
          name: AUCO_AGENT_NAME,
          instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
        },
        update: {
          isSystem: true,
          name: AUCO_AGENT_NAME,
          instructionsCompiled: AUCO_AGENT_INSTRUCTIONS,
        },
      });
    });
  });

  describe("getQuickAssistant", () => {
    it("returns existing agent when present", async () => {
      prisma.agent.findUnique.mockResolvedValue(mockAgent());

      const result = await service.getQuickAssistant();

      expect(result.presetId).toBe(QUICK_ASSISTANT_PRESET_ID);
      expect(prisma.agent.upsert).not.toHaveBeenCalled();
    });

    it("seeds when agent is missing", async () => {
      prisma.agent.findUnique.mockResolvedValue(null);
      prisma.agent.upsert.mockResolvedValue(mockAgent());

      const result = await service.getQuickAssistant();

      expect(result.name).toBe(AUCO_AGENT_NAME);
      expect(prisma.agent.upsert).toHaveBeenCalled();
    });
  });
});
