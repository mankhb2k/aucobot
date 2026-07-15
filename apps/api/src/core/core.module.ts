import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AgentsModule } from "./agents/agents.module";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { AppConfigModule } from "./config/config.module";
import { ConversationsModule } from "./conversations/conversations.module";
import { DatabaseModule } from "./database/database.module";
import { FeaturesModule } from "./features/features.module";
import { HealthModule } from "./health/health.module";
import { LoggingModule } from "./logging/logging.module";
import { PluginsModule } from "./plugins/plugins.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    DatabaseModule,
    FeaturesModule,
    PluginsModule,
    LoggingModule,
    RedisModule,
    AuthModule,
    HealthModule,
    AgentsModule,
    ConversationsModule,
    RealtimeModule,
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("{*splat}");
  }
}
