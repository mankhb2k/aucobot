import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";

import { AgentResolverService } from "./agent-resolver.service";

describe("AgentResolverService", () => {
  let service: AgentResolverService;

  const prisma = {
    conversationMember: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AgentResolverService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(AgentResolverService);
    jest.clearAllMocks();
  });

  describe("resolveForSession", () => {
    it("returns the default session agent", async () => {
      const agent = {
        id: "agent-1",
        name: "AucoAgent",
        presetId: "quick-assistant",
      };
      prisma.conversationMember.findFirst.mockResolvedValue({ agent });

      const result = await service.resolveForSession("conv-1");

      expect(result).toEqual(agent);
      expect(prisma.conversationMember.findFirst).toHaveBeenCalledWith({
        where: { conversationId: "conv-1", isDefault: true },
        include: { agent: true },
      });
    });

    it("throws when no default member exists", async () => {
      prisma.conversationMember.findFirst.mockResolvedValue(null);

      await expect(service.resolveForSession("conv-1")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
