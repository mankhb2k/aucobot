import { createTogetherAI } from "@ai-sdk/togetherai";
import { generateText, stepCountIs, streamText, type ToolSet } from "ai";

export const DEFAULT_TOGETHER_MODEL = "Qwen/Qwen2.5-7B-Instruct-Turbo";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentToolCallbacks = {
  onChunk?: (delta: string) => void;
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

export async function streamChatWithTogether(options: {
  apiKey: string;
  system: string;
  messages: ChatMessage[];
  model?: string;
  onChunk: (delta: string) => void;
}): Promise<string> {
  const together = createTogetherProvider(options.apiKey);
  const result = streamText({
    model: together(options.model ?? DEFAULT_TOGETHER_MODEL),
    system: options.system,
    messages: options.messages,
  });

  let full = "";
  for await (const delta of result.textStream) {
    if (!delta) continue;
    full += delta;
    options.onChunk(delta);
  }

  return full;
}

/** Multi-step agent stream with optional tools (Vercel AI SDK). */
export async function streamAgentWithTogether(options: {
  apiKey: string;
  system: string;
  messages: ChatMessage[];
  model?: string;
  tools?: ToolSet;
  maxSteps?: number;
  onChunk?: (delta: string) => void;
  onToolStart?: AgentToolCallbacks["onToolStart"];
  onToolFinish?: AgentToolCallbacks["onToolFinish"];
}): Promise<string> {
  const together = createTogetherProvider(options.apiKey);
  const maxSteps = options.maxSteps ?? 5;
  const hasTools = Boolean(options.tools && Object.keys(options.tools).length > 0);

  const result = streamText({
    model: together(options.model ?? DEFAULT_TOGETHER_MODEL),
    system: options.system,
    messages: options.messages,
    ...(hasTools
      ? {
          tools: options.tools,
          stopWhen: stepCountIs(maxSteps),
        }
      : {}),
    onToolExecutionStart: (event) => {
      const call = event.toolCall as {
        toolCallId: string;
        toolName: string;
        input?: unknown;
      };
      options.onToolStart?.({
        toolCallId: call.toolCallId,
        toolName: call.toolName,
        input: call.input,
      });
    },
    onToolExecutionEnd: (event) => {
      const call = event.toolCall as {
        toolCallId: string;
        toolName: string;
      };
      const output = event.toolOutput as {
        type: string;
        output?: unknown;
        error?: unknown;
      };
      const ok = output.type === "tool-result";
      const errorMessage =
        output.type === "tool-error"
          ? output.error instanceof Error
            ? output.error.message
            : String(output.error ?? "Tool failed")
          : undefined;
      options.onToolFinish?.({
        toolCallId: call.toolCallId,
        toolName: call.toolName,
        output: ok ? output.output : undefined,
        ok,
        errorMessage,
      });
    },
  });

  let full = "";
  for await (const delta of result.textStream) {
    if (!delta) continue;
    full += delta;
    options.onChunk?.(delta);
  }

  return full;
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
