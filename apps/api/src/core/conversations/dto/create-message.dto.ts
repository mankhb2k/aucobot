import { createZodDto } from "nestjs-zod";

import { createMessageSchema } from "@aucobot/shared";

export class CreateMessageDto extends createZodDto(createMessageSchema) {}
