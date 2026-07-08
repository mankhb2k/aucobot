import { createTogetherAI } from "@ai-sdk/togetherai";
import { generateText } from "ai";

export const DEFAULT_TOGETHER_MODEL = "Qwen/Qwen2.5-7B-Instruct-Turbo";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function createTogetherProvider(apiKey: string) {
  return createTogetherAI({ apiKey });
}

export async function generateChatWithTogether(options: {
  apiKey: string;
  system: string;
  messages: ChatMessage[];
  model?: string;
}): Promise<string> {
  const together = createTogetherProvider(options.apiKey);
  const result = await generateText({
    model: together(options.model ?? DEFAULT_TOGETHER_MODEL),
    system: options.system,
    messages: options.messages,
  });

  return result.text;
}

export async function generateTextWithTogether(options: {
  apiKey: string;
  prompt: string;
  model?: string;
}): Promise<string> {
  const together = createTogetherProvider(options.apiKey);
  const result = await generateText({
    model: together(options.model ?? DEFAULT_TOGETHER_MODEL),
    prompt: options.prompt,
  });

  return result.text;
}
