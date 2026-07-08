import { Test } from "@nestjs/testing";

import { PrismaService } from "../../../database/prisma.service";

import { HealthService } from "./health.service";

describe("HealthService", () => {
  let service: HealthService;

  const prisma = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [HealthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(HealthService);
  });

  it("returns ok when the database responds", async () => {
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const result = await service.check();

    expect(result.status).toBe("ok");
    expect(result.database).toBe("connected");
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns error when the database ping fails", async () => {
    prisma.$queryRaw.mockRejectedValue(new Error("connection refused"));

    const result = await service.check();

    expect(result.status).toBe("error");
    expect(result.database).toBe("disconnected");
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
