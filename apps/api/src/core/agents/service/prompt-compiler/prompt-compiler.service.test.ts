import { PromptCompilerService } from "./prompt-compiler.service";

describe("PromptCompilerService", () => {
  const compiler = new PromptCompilerService();

  it("compiles identity, tone, role, and skill groups", () => {
    const result = compiler.compile({
      name: "Mai Content",
      role: "Content creator",
      description: "Viết caption TikTok. Không đăng hộ.",
      tonePreset: "casual",
      toneNotes: undefined,
      enabledSkillGroups: ["web-search", "tiktok"],
    });

    expect(result).toContain("## Identity\nMai Content");
    expect(result).toContain("## Tone\ncasual");
    expect(result).toContain("Content creator");
    expect(result).toContain("Viết caption TikTok. Không đăng hộ.");
    expect(result).toContain("- web-search");
    expect(result).toContain("- tiktok");
  });

  it("prefers toneNotes over preset label", () => {
    const result = compiler.compile({
      name: "CS Bot",
      role: "Customer support",
      tonePreset: "professional",
      toneNotes: "Always reply in Vietnamese.",
      enabledSkillGroups: [],
    });

    expect(result).toContain("Always reply in Vietnamese.");
    expect(result).not.toContain("professional —");
  });
});
