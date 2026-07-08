import { z } from "zod";

import { FEATURE_IDS } from "../features/feature.constants";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  DATABASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().int().positive().default(8387),
  WEB_ORIGIN: z.string().url().default("http://app.localhost:8386"),
  MARKETING_ORIGIN: z.string().url().default("http://localhost:8386"),
  JWT_SECRET: z.string().min(16).default("dev-jwt-secret-change-me-in-production"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  AUTH_ACCESS_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(900_000),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(30),
  AUTH_REFRESH_COOKIE_MAX_AGE_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(2_592_000_000),
  /** Production: `.aucobot.com` so www / app / api share session cookies. Omit in dev. */
  AUTH_COOKIE_DOMAIN: z
    .string()
    .regex(/^\./, "AUTH_COOKIE_DOMAIN must start with '.' (e.g. .aucobot.com)")
    .optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default("http://localhost:8387/api/auth/google/callback"),
  /** Dev only — email for POST /api/auth/dev-login (find-or-create). Ignored in production. */
  DEV_AUTH_EMAIL: z.string().email().default("dev@aucobot.local"),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Aucobot <noreply@send.aucobot.com>"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  REDIS_KEY_PREFIX: z
    .string()
    .min(1)
    .default("aucobot:")
    .transform((value) => (value.endsWith(":") ? value : `${value}:`)),
  EMAIL_OTP_EXPIRES_MINUTES: z.coerce.number().int().positive().default(10),
  EMAIL_OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(60),
  EMAIL_OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  EMAIL_OTP_IP_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  EMAIL_OTP_IP_WINDOW_SECONDS: z.coerce.number().int().positive().default(600),
  EMAIL_OTP_HMAC_SECRET: z.string().min(16).optional(),
  /** CSV các feature bật, vd `facebook,publishing`. Rỗng ở MVP. Id lạ → lỗi boot. */
  ENABLED_FEATURES: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.enum(FEATURE_IDS))),
  /** Together AI — required when ai-orchestration feature is enabled. */
  TOGETHER_API_KEY: z.string().optional(),
  TOGETHER_MODEL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
