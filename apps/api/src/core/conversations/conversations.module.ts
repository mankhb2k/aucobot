import { Module } from "@nestjs/common";

import { AgentsModule } from "../agents/agents.module";
import { DatabaseModule } from "../database/database.module";

import { ConversationsController } from "./conversations.controller";
import { MessagesController } from "./messages.controller";
import { ConversationAccessService } from "./service/conversation-access/conversation-access.service";
import { ConversationsService } from "./service/conversations/conversations.service";
import { MessagesService } from "./service/messages/messages.service";

@Module({
  imports: [DatabaseModule, AgentsModule],
  controllers: [ConversationsController, MessagesController],
  providers: [ConversationsService, ConversationAccessService, MessagesService],
  exports: [ConversationsService, ConversationAccessService, MessagesService],
})
export class ConversationsModule {}
