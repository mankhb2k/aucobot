import { tool, type ToolSet } from "ai";
import { z } from "zod";

export type AucobotToolDefinition<TInput extends z.ZodType = z.ZodType> = {
  name: string;
  description: string;
  skillGroup: string;
  inputSchema: TInput;
  execute: (input: z.infer<TInput>) => Promise<unknown> | unknown;
};

/** Wrap a Zod-backed tool for Vercel AI SDK `tools` map. */
export function createAucobotTool<TInput extends z.ZodType>(
  definition: AucobotToolDefinition<TInput>,
) {
  return tool({
    description: definition.description,
    inputSchema: definition.inputSchema,
    execute: async (input) => definition.execute(input as z.infer<TInput>),
  });
}

export function toolsToToolSet(
  entries: Array<{ name: string; tool: ReturnType<typeof createAucobotTool> }>,
): ToolSet {
  const set: ToolSet = {};
  for (const entry of entries) {
    set[entry.name] = entry.tool;
  }
  return set;
}

export const webSearchInputSchema = z.object({
  query: z.string().min(1).describe("Search query for market/trend research"),
});

export const readDocumentInputSchema = z.object({
  documentId: z
    .string()
    .optional()
    .describe("Document id in the conversation library"),
  query: z
    .string()
    .optional()
    .describe("Match document by title substring when id is unknown"),
});

export const updateAgentMemoryInputSchema = z.object({
  insight: z
    .string()
    .min(1)
    .describe("Durable insight to remember for this user/room"),
  scope: z
    .enum(["conversation", "user"])
    .optional()
    .describe("Memory scope; defaults to conversation"),
});
