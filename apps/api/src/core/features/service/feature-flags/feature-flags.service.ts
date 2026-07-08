import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { FeatureId } from "../../feature.constants";

/**
 * Runtime feature toggle — nguồn sự thật là env `ENABLED_FEATURES` (qua config).
 *
 * Dùng để feature module / core code tự bảo vệ hành vi khi feature tắt.
 * DI-safe: đọc `ConfigService` sau khi env đã nạp.
 */
@Injectable()
export class FeatureFlagsService {
  private readonly enabled: ReadonlySet<FeatureId>;

  constructor(configService: ConfigService) {
    this.enabled = new Set(configService.get<FeatureId[]>("enabledFeatures") ?? []);
  }

  isEnabled(id: FeatureId): boolean {
    return this.enabled.has(id);
  }

  /** Ném 404 (ẩn sự tồn tại) khi feature tắt — dùng đầu handler thuộc feature. */
  assertEnabled(id: FeatureId): void {
    if (!this.isEnabled(id)) {
      throw new NotFoundException(`Feature "${id}" is not enabled`);
    }
  }

  getEnabled(): FeatureId[] {
    return [...this.enabled];
  }
}
