import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller";
import { HealthService } from "./service/health/health.service";

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
