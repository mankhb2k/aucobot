import { Module } from "@nestjs/common";

import { ConversationsModule } from "../../../core/conversations/conversations.module";

import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { R2StorageService } from "./r2.storage";
import { ReadDocumentToolService } from "./read-document-tool.service";

@Module({
  imports: [ConversationsModule],
  controllers: [DocumentsController],
  providers: [R2StorageService, DocumentsService, ReadDocumentToolService],
  exports: [DocumentsService, ReadDocumentToolService],
})
export class ReadDocumentModule {}
