import { Injectable, OnModuleInit } from "@nestjs/common";

import { createAucobotTool, readDocumentInputSchema } from "@aucobot/mcp-core";
import { SKILL_GROUP_KNOWLEDGE, TOOL_UI_LABELS } from "@aucobot/shared";

import { PluginRegistry } from "../../../core/plugins/plugin.registry";

import { DocumentsService } from "./documents.service";

@Injectable()
export class ReadDocumentToolService implements OnModuleInit {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly registry: PluginRegistry,
  ) {}

  onModuleInit(): void {
    this.registry.register({
      name: "read_document",
      skillGroup: SKILL_GROUP_KNOWLEDGE,
      label: TOOL_UI_LABELS.read_document,
      create: (ctx) =>
        createAucobotTool({
          name: "read_document",
          description:
            "Read a document from the conversation document library (PDF/DOCX/text).",
          skillGroup: SKILL_GROUP_KNOWLEDGE,
          inputSchema: readDocumentInputSchema,
          execute: async (input) =>
            this.documentsService.readForTool({
              ownerId: ctx.ownerId,
              conversationId: ctx.conversationId,
              documentId: input.documentId,
              query: input.query,
            }),
        }),
    });
  }
}
