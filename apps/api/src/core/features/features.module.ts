import { Global, Module } from "@nestjs/common";

import { FeatureFlagsService } from "./service/feature-flags/feature-flags.service";

@Global()
@Module({
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeaturesModule {}
