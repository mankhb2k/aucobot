import { Module } from "@nestjs/common";

import { CoreModule } from "./core/core.module";
import { loadEnabledFeatures } from "./features/feature-registry";

@Module({
  imports: [CoreModule, ...loadEnabledFeatures()],
})
export class AppModule {}
