import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { SKILL_GROUP_KNOWLEDGE } from "@aucobot/shared";

import { PluginRegistry } from "../../../core/plugins/plugin.registry";

import { WebSearchService } from "./web-search.service";

jest.mock("@aucobot/mcp-core", () => ({
  webSearchInputSchema: {
    parse: (value: unknown) => value,
  },
  createAucobotTool: (definition: {
    name: string;
    execute: (input: { query: string }) => Promise<unknown>;
  }) => ({
    description: definition.name,
    execute: definition.execute,
  }),
}));

describe("WebSearchService", () => {
  let service: WebSearchService;
  let registry: PluginRegistry;

  const configService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    registry = new PluginRegistry();
    const module = await Test.createTestingModule({
      providers: [
        WebSearchService,
        { provide: ConfigService, useValue: configService },
        { provide: PluginRegistry, useValue: registry },
      ],
    }).compile();

    service = module.get(WebSearchService);
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("registers web_search under knowledge on init", () => {
    service.onModuleInit();

    const meta = registry.listMeta([SKILL_GROUP_KNOWLEDGE]);
    expect(meta.some((m) => m.name === "web_search")).toBe(true);

    const tools = registry.getToolsForSkillGroups([SKILL_GROUP_KNOWLEDGE], {
      ownerId: "u1",
      agentId: "a1",
      conversationId: "c1",
    });
    expect(tools.web_search).toBeDefined();
  });

  it("throws when TAVILY_API_KEY is missing", async () => {
    configService.get.mockReturnValue(undefined);

    await expect(service.search("vietnam ai")).rejects.toThrow(
      "TAVILY_API_KEY is not configured",
    );
  });

  it("maps Tavily results", async () => {
    configService.get.mockImplementation((key: string) => {
      if (key === "tavilyApiKey") return "tvly-test";
      return undefined;
    });

    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            title: "Vietnam AI Challenge",
            url: "https://example.com/vai",
            content: "A national AI program.",
          },
        ],
      }),
    } as Response);

    const result = await service.search("Vietnam AI Innovation Challenge");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.tavily.com/search",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result).toEqual({
      query: "Vietnam AI Innovation Challenge",
      results: [
        {
          title: "Vietnam AI Challenge",
          url: "https://example.com/vai",
          snippet: "A national AI program.",
        },
      ],
    });
  });

  it("throws on non-OK Tavily response", async () => {
    configService.get.mockReturnValue("tvly-test");
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "unauthorized",
    } as Response);

    await expect(service.search("x")).rejects.toThrow("Web search failed (401)");
  });
});
