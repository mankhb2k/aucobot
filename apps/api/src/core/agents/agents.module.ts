import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";

import { AgentsController } from "./agents.controller";
import { AgentResolverService } from "./service/agent-resolver/agent-resolver.service";
import { AgentsService } from "./service/agents/agents.service";
import { PromptCompilerService } from "./service/prompt-compiler/prompt-compiler.service";
import { SystemAgentsService } from "./service/system-agents/system-agents.service";

@Module({
  imports: [DatabaseModule],
  controllers: [AgentsController],
  providers: [
    SystemAgentsService,
    AgentResolverService,
    PromptCompilerService,
    AgentsService,
  ],
  exports: [
    SystemAgentsService,
    AgentResolverService,
    PromptCompilerService,
    AgentsService,
  ],
})
export class AgentsModule {}
