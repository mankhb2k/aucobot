import { createZodDto } from "nestjs-zod";

import { createAgentSchema } from "@aucobot/shared";

export class CreateAgentDto extends createZodDto(createAgentSchema) {}
