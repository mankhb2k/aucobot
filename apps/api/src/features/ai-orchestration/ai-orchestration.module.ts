import { Global, Module } from "@nestjs/common";

import { LLM_COMPLETION_PORT } from "../../core/plugins/llm-completion.port";

import { AiOrchestrationService } from "./service/ai-orchestration/ai-orchestration.service";

@Global()
@Module({
  providers: [
    AiOrchestrationService,
    {
      provide: LLM_COMPLETION_PORT,
      useExisting: AiOrchestrationService,
    },
  ],
  exports: [AiOrchestrationService, LLM_COMPLETION_PORT],
})
export class AiOrchestrationModule {}
