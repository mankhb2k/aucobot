import type { ConfigService } from "@nestjs/config";
import type { Params } from "nestjs-pino";
import type { IncomingMessage } from "node:http";

export function createPinoParams(configService: ConfigService): Params {
  const nodeEnv = configService.getOrThrow<string>("nodeEnv");
  const isDevelopment = nodeEnv === "development";

  return {
    pinoHttp: {
      level: configService.getOrThrow<string>("logLevel"),
      autoLogging: false,
      transport: isDevelopment
        ? {
            target: "pino-pretty",
            options: {
              singleLine: true,
              colorize: true,
              ignore: "pid,hostname",
            },
          }
        : undefined,
      customProps: (req: IncomingMessage & { requestId?: string }) => ({
        requestId: req.requestId,
      }),
    },
  };
}
