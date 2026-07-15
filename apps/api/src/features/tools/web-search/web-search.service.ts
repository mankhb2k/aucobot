import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { createAucobotTool, webSearchInputSchema } from "@aucobot/mcp-core";
import { SKILL_GROUP_KNOWLEDGE, TOOL_UI_LABELS } from "@aucobot/shared";

import { PluginRegistry } from "../../../core/plugins/plugin.registry";

@Injectable()
export class WebSearchService implements OnModuleInit {
  private readonly logger = new Logger(WebSearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly registry: PluginRegistry,
  ) {}

  onModuleInit(): void {
    if (!this.configService.get<string>("tavilyApiKey")) {
      this.logger.warn(
        "web-search feature loaded but TAVILY_API_KEY is missing — web_search will fail at runtime",
      );
    }

    this.registry.register({
      name: "web_search",
      skillGroup: SKILL_GROUP_KNOWLEDGE,
      label: TOOL_UI_LABELS.web_search,
      create: () =>
        createAucobotTool({
          name: "web_search",
          description:
            "Search the live web via Tavily. ALWAYS call this tool when the user asks to search Google/web, look up current events, programs, or facts you are not sure about. Do not claim you cannot search.",
          skillGroup: SKILL_GROUP_KNOWLEDGE,
          inputSchema: webSearchInputSchema,
          execute: async (input) => this.search(input.query),
        }),
    });
  }

  async search(query: string): Promise<{
    query: string;
    results: Array<{ title: string; url: string; snippet: string }>;
  }> {
    const apiKey = this.configService.get<string>("tavilyApiKey");
    if (!apiKey) {
      throw new Error("TAVILY_API_KEY is not configured");
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.warn(`Tavily error ${response.status}: ${body}`);
      throw new Error(`Web search failed (${response.status})`);
    }

    const data = (await response.json()) as {
      results?: Array<{ title?: string; url?: string; content?: string }>;
    };

    return {
      query,
      results: (data.results ?? []).map((item) => ({
        title: item.title ?? "",
        url: item.url ?? "",
        snippet: (item.content ?? "").slice(0, 400),
      })),
    };
  }
}
