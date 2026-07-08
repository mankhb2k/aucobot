import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../common/decorators/current-user.decorator";

import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ConversationsService } from "./service/conversations/conversations.service";

import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
import type { ConversationListResponse, ConversationResponse } from "@aucobot/shared";

@ApiTags("Conversations")
@ApiCookieAuth("access_token")
@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: "List conversations for the current user" })
  @ApiOkResponse({ description: "Sidebar inbox list" })
  list(@CurrentUser() user: AuthenticatedUser): Promise<ConversationListResponse> {
    return this.conversationsService.listForUser(user.userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a room or session" })
  @ApiOkResponse({ description: "New conversation" })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationResponse> {
    return this.conversationsService.createForUser(user.userId, dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get conversation metadata" })
  @ApiOkResponse({ description: "Conversation details" })
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<ConversationResponse> {
    return this.conversationsService.getForUser(user.userId, id);
  }
}
