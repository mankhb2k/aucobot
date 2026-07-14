import { Module, forwardRef } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { ConversationsModule } from "../conversations/conversations.module";

import { CONVERSATION_EVENTS_PORT } from "./conversation-events.port";
import { ConversationsGateway } from "./conversations.gateway";

@Module({
  imports: [AuthModule, forwardRef(() => ConversationsModule)],
  providers: [
    ConversationsGateway,
    {
      provide: CONVERSATION_EVENTS_PORT,
      useExisting: ConversationsGateway,
    },
  ],
  exports: [ConversationsGateway, CONVERSATION_EVENTS_PORT],
})
export class RealtimeModule {}
