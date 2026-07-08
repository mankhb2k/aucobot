import { Module } from "@nestjs/common";

import { LoggingModule } from "../logging/logging.module";

import { EmailService } from "./service/email/email.service";

@Module({
  imports: [LoggingModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
