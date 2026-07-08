import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { parseEnabledFeatures } from "../../feature.constants";

import { FeatureFlagsService } from "./feature-flags.service";

async function buildService(enabled: string[]): Promise<FeatureFlagsService> {
  const module = await Test.createTestingModule({
    providers: [
      FeatureFlagsService,
      { provide: ConfigService, useValue: { get: () => enabled } },
    ],
  }).compile();

  return module.get(FeatureFlagsService);
}

describe("FeatureFlagsService", () => {
  it("reports enabled features from config", async () => {
    const service = await buildService(["facebook", "publishing"]);

    expect(service.isEnabled("facebook")).toBe(true);
    expect(service.isEnabled("publishing")).toBe(true);
    expect(service.isEnabled("tiktok")).toBe(false);
    expect(service.getEnabled()).toEqual(["facebook", "publishing"]);
  });

  it("treats missing config as no features", async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeatureFlagsService,
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    const service = module.get(FeatureFlagsService);

    expect(service.isEnabled("facebook")).toBe(false);
    expect(service.getEnabled()).toEqual([]);
  });

  it("assertEnabled throws NotFound when feature is off", async () => {
    const service = await buildService([]);

    expect(() => service.assertEnabled("facebook")).toThrow(NotFoundException);
  });

  it("assertEnabled passes when feature is on", async () => {
    const service = await buildService(["facebook"]);

    expect(() => service.assertEnabled("facebook")).not.toThrow();
  });
});

describe("parseEnabledFeatures", () => {
  it("parses CSV and drops unknown / empty ids", () => {
    expect(parseEnabledFeatures("facebook, publishing ,bogus,")).toEqual([
      "facebook",
      "publishing",
    ]);
  });

  it("returns empty for undefined", () => {
    expect(parseEnabledFeatures(undefined)).toEqual([]);
  });
});
