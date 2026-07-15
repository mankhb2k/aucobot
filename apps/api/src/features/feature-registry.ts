import {
  parseEnabledFeatures,
  type FeatureId,
} from "../core/features/feature.constants";

import { AiOrchestrationModule } from "./ai-orchestration/ai-orchestration.module";
import { ReadDocumentModule } from "./tools/read-document/read-document.module";
import { UpdateAgentMemoryModule } from "./tools/update-agent-memory/update-agent-memory.module";
import { WebSearchModule } from "./tools/web-search/web-search.module";

import type { DynamicModule, Type } from "@nestjs/common";

type FeatureModule = Type<unknown> | DynamicModule;

const FEATURE_REGISTRY: Partial<Record<FeatureId, () => FeatureModule>> = {
  "ai-orchestration": () => AiOrchestrationModule,
  documents: () => ReadDocumentModule,
  "web-search": () => WebSearchModule,
};

/**
 * Trả về các feature module được bật (đọc `ENABLED_FEATURES` lúc bootstrap).
 * `update_agent_memory` luôn nạp kèm khi `ai-orchestration` bật (không có feature id riêng).
 */
export function loadEnabledFeatures(): FeatureModule[] {
  const ids = parseEnabledFeatures(process.env.ENABLED_FEATURES);
  const modules = ids
    .map((id) => FEATURE_REGISTRY[id]?.())
    .filter((module): module is FeatureModule => Boolean(module));

  if (ids.includes("ai-orchestration")) {
    modules.push(UpdateAgentMemoryModule);
  }

  return modules;
}
