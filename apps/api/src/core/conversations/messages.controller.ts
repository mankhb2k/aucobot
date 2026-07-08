import { Controller, Get, HttpCode, Param, Post, Body } from "@nestjs/common";
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { CurrentUser } from "../common/decorators/current-user.decorator";

import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./service/messages/messages.service";

import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import type { MessageListResponse, SendMessageResponse } from "@aucobot/shared";

@ApiTags("Conversations")
@ApiCookieAuth("access_token")
@Controller("conversations/:conversationId/messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: "List messages in a conversation" })
  @ApiOkResponse({ description: "Message history" })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("conversationId") conversationId: string,
  ): Promise<MessageListResponse> {
    return this.messagesService.listForConversation(user.userId, conversationId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Send a message and receive an assistant reply" })
  @ApiCreatedResponse({ description: "User message and assistant reply" })
  send(
    @CurrentUser() user: AuthenticatedUser,
    @Param("conversationId") conversationId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<SendMessageResponse> {
    return this.messagesService.sendMessage(user.userId, conversationId, dto);
  }
}
