import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../database/prisma.service";

import type { HealthResponse } from "@aucobot/shared";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponse> {
    let database: HealthResponse["database"] = "disconnected";

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "disconnected";
    }

    return {
      status: database === "connected" ? "ok" : "error",
      timestamp: new Date().toISOString(),
      database,
    };
  }
}
