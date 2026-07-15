import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { memoryStorage } from "multer";

import { DOCUMENT_MAX_BYTES } from "@aucobot/shared";

import { CurrentUser } from "../../../core/common/decorators/current-user.decorator";

import { DocumentsService } from "./documents.service";

import type { AuthenticatedUser } from "../../../core/common/decorators/current-user.decorator";
import type { DocumentListResponse, DocumentResponse } from "@aucobot/shared";

@ApiTags("Documents")
@ApiCookieAuth("access_token")
@Controller("conversations/:conversationId/documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: "List documents in a conversation" })
  @ApiOkResponse({ description: "Document library items" })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("conversationId") conversationId: string,
  ): Promise<DocumentListResponse> {
    return this.documentsService.listForConversation(user.userId, conversationId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: DOCUMENT_MAX_BYTES },
    }),
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
      required: ["file"],
    },
  })
  @ApiOperation({ summary: "Upload a document to conversation library (R2)" })
  @ApiOkResponse({ description: "Uploaded document metadata" })
  async upload(
    @CurrentUser() user: AuthenticatedUser,
    @Param("conversationId") conversationId: string,
    @UploadedFile()
    file:
      | {
          originalname: string;
          mimetype: string;
          buffer: Buffer;
          size: number;
        }
      | undefined,
  ): Promise<DocumentResponse> {
    if (!file) {
      throw new BadRequestException("file is required");
    }

    return this.documentsService.upload({
      userId: user.userId,
      conversationId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });
  }
}
