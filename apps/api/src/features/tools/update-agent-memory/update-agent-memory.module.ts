import { Module } from "@nestjs/common";

import { UpdateAgentMemoryService } from "./update-agent-memory.service";

@Module({
  providers: [UpdateAgentMemoryService],
  exports: [UpdateAgentMemoryService],
})
export class UpdateAgentMemoryModule {}
