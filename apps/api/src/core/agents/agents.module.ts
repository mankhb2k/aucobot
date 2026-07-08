import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";

import { AgentResolverService } from "./service/agent-resolver/agent-resolver.service";
import { SystemAgentsService } from "./service/system-agents/system-agents.service";

@Module({
  imports: [DatabaseModule],
  providers: [SystemAgentsService, AgentResolverService],
  exports: [SystemAgentsService, AgentResolverService],
})
export class AgentsModule {}
