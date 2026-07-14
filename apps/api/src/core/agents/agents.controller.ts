import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../common/decorators/current-user.decorator";

import { CreateAgentDto } from "./dto/create-agent.dto";
import { AgentsService } from "./service/agents/agents.service";

import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import type {
  AgentDmResponse,
  AgentListResponse,
  AgentResponse,
  MotherDmResponse,
} from "@aucobot/shared";

@ApiTags("Agents")
@ApiCookieAuth("access_token")
@Controller("agents")
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @ApiOperation({ summary: "List user agents (excludes system templates)" })
  @ApiOkResponse({ description: "User agent directory" })
  list(@CurrentUser() user: AuthenticatedUser): Promise<AgentListResponse> {
    return this.agentsService.listForUser(user.userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a user agent (wizard payload after user signs)" })
  @ApiOkResponse({ description: "Created agent" })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAgentDto,
  ): Promise<AgentResponse> {
    return this.agentsService.createForUser(user.userId, dto);
  }

  @Post("mother/dm")
  @ApiOperation({ summary: "Get or create AucoMother DM session (Together/Qwen chat)" })
  @ApiOkResponse({ description: "Mother session + agent meta" })
  ensureMotherDm(@CurrentUser() user: AuthenticatedUser): Promise<MotherDmResponse> {
    return this.agentsService.ensureMotherDm(user.userId);
  }

  @Post(":id/dm")
  @ApiOperation({ summary: "Get or create DM session for an owned user agent" })
  @ApiOkResponse({ description: "Agent DM session + agent meta" })
  ensureAgentDm(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<AgentDmResponse> {
    return this.agentsService.ensureAgentDm(user.userId, id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user agent by id" })
  @ApiOkResponse({ description: "Agent details" })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<AgentResponse> {
    return this.agentsService.getForUser(user.userId, id);
  }
}
