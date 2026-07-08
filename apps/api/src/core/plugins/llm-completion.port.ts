export const LLM_COMPLETION_PORT = Symbol("LLM_COMPLETION_PORT");

export type LlmChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface LlmCompletionPort {
  complete(input: { system: string; messages: LlmChatMessage[] }): Promise<string>;
}
