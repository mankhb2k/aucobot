import { Injectable } from "@nestjs/common";

import type { AgentTonePreset, CreateAgentInput } from "@aucobot/shared";

const TONE_LABELS: Record<AgentTonePreset, string> = {
  friendly: 'friendly — xưng "bạn", gọn gàng, hữu ích.',
  professional: "professional — trang trọng, rõ ràng, ngắn gọn.",
  casual: "casual — thoải mái, gần gũi, không cứng nhắc.",
};

export type CompileAgentPromptInput = Pick<
  CreateAgentInput,
  "name" | "role" | "description" | "tonePreset" | "toneNotes" | "enabledSkillGroups"
>;

@Injectable()
export class PromptCompilerService {
  compile(input: CompileAgentPromptInput): string {
    const tone =
      input.toneNotes?.trim() || TONE_LABELS[input.tonePreset] || TONE_LABELS.friendly;

    const sections = [
      `## Identity\n${input.name.trim()}`,
      `## Tone\n${tone}`,
      `## Role & scope\n${input.role.trim()}${
        input.description?.trim() ? `\n${input.description.trim()}` : ""
      }`,
    ];

    if (input.enabledSkillGroups.length > 0) {
      sections.push(
        `## Enabled skill groups\n${input.enabledSkillGroups.map((g) => `- ${g}`).join("\n")}`,
      );
    }

    sections.push(
      "KHÔNG giả vờ có quyền truy cập hệ thống hay dữ liệu user ngoài cuộc hội thoại.",
    );

    return sections.join("\n\n");
  }
}
