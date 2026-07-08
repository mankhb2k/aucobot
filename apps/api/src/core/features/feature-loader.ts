import { parseEnabledFeatures, type FeatureId } from "./feature.constants";

import type { DynamicModule, Type } from "@nestjs/common";

type FeatureModule = Type<unknown> | DynamicModule;

/**
 * Registry feature → module (legacy stub in core).
 * **Đăng ký feature thật:** `src/features/feature-registry.ts`
 */
const FEATURE_REGISTRY: Partial<Record<FeatureId, () => FeatureModule>> = {};

/** @deprecated Prefer `loadEnabledFeatures` from `src/features/feature-registry.ts` */
export function loadEnabledFeatures(): FeatureModule[] {
  return parseEnabledFeatures(process.env.ENABLED_FEATURES)
    .map((id) => FEATURE_REGISTRY[id]?.())
    .filter((module): module is FeatureModule => Boolean(module));
}
