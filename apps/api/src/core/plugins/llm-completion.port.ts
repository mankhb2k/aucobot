export const LLM_COMPLETION_PORT = Symbol("LLM_COMPLETION_PORT");

export type LlmChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface LlmCompletionPort {
  complete(input: { system: string; messages: LlmChatMessage[] }): Promise<string>;

  stream?(input: {
    system: string;
    messages: LlmChatMessage[];
    onChunk: (delta: string) => void;
    skillGroups?: string[];
    toolContext?: {
      ownerId: string;
      agentId: string;
      conversationId: string;
    };
    onToolStart?: (event: {
      toolCallId: string;
      toolName: string;
      input: unknown;
    }) => void;
    onToolFinish?: (event: {
      toolCallId: string;
      toolName: string;
      output: unknown;
      ok: boolean;
      errorMessage?: string;
    }) => void;
  }): Promise<string>;

  toolLabel?(name: string): string;
}
