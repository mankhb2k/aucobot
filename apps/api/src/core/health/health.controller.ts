import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "../common/decorators/public.decorator";

import { HealthService } from "./service/health/health.service";

import type { HealthResponse } from "@aucobot/shared";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "API and database health check" })
  @ApiOkResponse({ description: "Service status" })
  getHealth(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
