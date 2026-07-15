import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import {
  DOCUMENT_ALLOWED_MIME_TYPES,
  DOCUMENT_MAX_BYTES,
  type DocumentListResponse,
  type DocumentResponse,
} from "@aucobot/shared";

import { ConversationAccessService } from "../../../core/conversations/service/conversation-access/conversation-access.service";
import { PrismaService } from "../../../core/database/prisma.service";

import { extractDocumentText } from "./extract-text";
import { R2StorageService } from "./r2.storage";

import type { Document } from "@aucobot/database";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ConversationAccessService,
    private readonly r2: R2StorageService,
  ) {}

  async listForConversation(
    userId: string,
    conversationId: string,
  ): Promise<DocumentListResponse> {
    await this.access.assert(userId, conversationId);
    const rows = await this.prisma.document.findMany({
      where: { conversationId, ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return { items: rows.map((row) => this.toResponse(row)) };
  }

  async upload(input: {
    userId: string;
    conversationId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<DocumentResponse> {
    await this.access.assert(input.userId, input.conversationId);

    if (input.buffer.byteLength === 0) {
      throw new BadRequestException("Empty file");
    }
    if (input.buffer.byteLength > DOCUMENT_MAX_BYTES) {
      throw new BadRequestException(`File exceeds ${DOCUMENT_MAX_BYTES} bytes limit`);
    }
    if (!(DOCUMENT_ALLOWED_MIME_TYPES as readonly string[]).includes(input.mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${input.mimeType}`);
    }

    const title = input.fileName.trim() || "untitled";
    const created = await this.prisma.document.create({
      data: {
        ownerId: input.userId,
        conversationId: input.conversationId,
        title,
        mimeType: input.mimeType,
        sizeBytes: input.buffer.byteLength,
        r2Key: "pending",
        extractStatus: "pending",
      },
    });

    const safeName = title.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
    const r2Key = `owners/${input.userId}/conversations/${input.conversationId}/${created.id}/${safeName}`;

    try {
      await this.r2.putObject({
        key: r2Key,
        body: input.buffer,
        contentType: input.mimeType,
      });

      let extractedText: string | null = null;
      let extractStatus: "ready" | "failed" = "ready";
      try {
        extractedText = await extractDocumentText({
          buffer: input.buffer,
          mimeType: input.mimeType,
        });
      } catch {
        extractStatus = "failed";
        extractedText = null;
      }

      const updated = await this.prisma.document.update({
        where: { id: created.id },
        data: {
          r2Key,
          extractedText,
          extractStatus,
        },
      });

      return this.toResponse(updated);
    } catch (error) {
      await this.prisma.document
        .delete({ where: { id: created.id } })
        .catch(() => undefined);
      throw error;
    }
  }

  async readForTool(input: {
    ownerId: string;
    conversationId: string;
    documentId?: string;
    query?: string;
  }): Promise<{
    id: string;
    title: string;
    extractStatus: string;
    content: string;
  }> {
    let row: Document | null = null;

    if (input.documentId) {
      row = await this.prisma.document.findFirst({
        where: {
          id: input.documentId,
          conversationId: input.conversationId,
          ownerId: input.ownerId,
        },
      });
    } else if (input.query?.trim()) {
      const q = input.query.trim();
      row = await this.prisma.document.findFirst({
        where: {
          conversationId: input.conversationId,
          ownerId: input.ownerId,
          title: { contains: q, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      row = await this.prisma.document.findFirst({
        where: {
          conversationId: input.conversationId,
          ownerId: input.ownerId,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!row) {
      throw new NotFoundException("Document not found in this conversation");
    }

    return {
      id: row.id,
      title: row.title,
      extractStatus: row.extractStatus,
      content: (row.extractedText ?? "").slice(0, 20_000) || "(no extracted text)",
    };
  }

  private toResponse(row: Document): DocumentResponse {
    return {
      id: row.id,
      conversationId: row.conversationId,
      title: row.title,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      extractStatus: row.extractStatus,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
