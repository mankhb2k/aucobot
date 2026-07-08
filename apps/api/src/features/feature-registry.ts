import {
  parseEnabledFeatures,
  type FeatureId,
} from "../core/features/feature.constants";

import { AiOrchestrationModule } from "./ai-orchestration/ai-orchestration.module";

import type { DynamicModule, Type } from "@nestjs/common";

type FeatureModule = Type<unknown> | DynamicModule;

const FEATURE_REGISTRY: Partial<Record<FeatureId, () => FeatureModule>> = {
  "ai-orchestration": () => AiOrchestrationModule,
};

/**
 * Trả về các feature module được bật (đọc `ENABLED_FEATURES` lúc bootstrap).
 */
export function loadEnabledFeatures(): FeatureModule[] {
  return parseEnabledFeatures(process.env.ENABLED_FEATURES)
    .map((id) => FEATURE_REGISTRY[id]?.())
    .filter((module): module is FeatureModule => Boolean(module));
}
