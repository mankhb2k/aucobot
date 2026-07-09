/**
 * ESLint flat config for @aucobot/api (NestJS).
 *
 * Layers:
 *  1. Base JS + TypeScript type-checked rules (projectService)
 *  2. Global rules for all *.ts
 *  3. Overrides per file pattern (controllers, DTOs, middleware, tests)
 *
 * CI: `pnpm --filter @aucobot/api lint:ci` (zero warnings).
 * Build workspace packages first so @aucobot/* types resolve (see .github/workflows/ci.yml).
 */
import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

/** Feature plugin roots under src/features/ — each is an isolated deploy-time module. */
const featureRoots = [
  "tools",
  "integrations",
  "channels",
  "workflow",
  "ai-orchestration",
];

/** Cross-feature imports are forbidden (manifest barrel is exempt). */
function featureCrossImportZones() {
  const zones = [];

  for (const target of featureRoots) {
    for (const from of featureRoots) {
      if (target === from) {
        continue;
      }

      zones.push({
        target: `./src/features/${target}`,
        from: `./src/features/${from}`,
        message:
          "Features must not import each other directly — use core/events or @aucobot/shared.",
      });
    }
  }

  return zones;
}

/** Runtime safety and general JS hygiene — applied to all API source files. */
const coreSafetyRules = {
  eqeqeq: ["error", "always", { null: "ignore" }],
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",
  "no-throw-literal": "error",
  "prefer-promise-reject-errors": "error",
  "array-callback-return": "error",
  "no-promise-executor-return": "error",
  "no-return-assign": "error",
  "no-self-assign": "error",
  "no-unreachable-loop": "error",
  "no-unsafe-optional-chaining": "error",
  "no-console": "error",
  "no-param-reassign": [
    "error",
    {
      props: true,
      ignorePropertyModificationsFor: ["acc", "draft", "state"],
    },
  ],
  "consistent-return": "error",
  "default-case": "error",
  "default-case-last": "error",
  "prefer-template": "error",
  "guard-for-in": "error",
};

/** Import graph hygiene — blank lines between groups, @aucobot/* before relative paths. */
const importRules = {
  "import/no-duplicates": "error",
  "import/no-self-import": "error",
  "import/no-useless-path-segments": "error",
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
      pathGroups: [{ pattern: "@aucobot/**", group: "internal", position: "before" }],
      pathGroupsExcludedImportTypes: ["type"],
      alphabetize: { order: "asc", caseInsensitive: true },
      "newlines-between": "always",
    },
  ],
};

/** Strict TypeScript — requires type-checked lint (projectService: true below). */
const typescriptErrorRules = {
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      "ts-expect-error": "allow-with-description",
      "ts-ignore": true,
      "ts-nocheck": true,
    },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "separate-type-imports" },
  ],
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: { attributes: false },
    },
  ],
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/no-unsafe-return": "error",
  "@typescript-eslint/no-unsafe-call": "error",
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/require-await": "error",
  "@typescript-eslint/no-base-to-string": "error",
  "@typescript-eslint/no-require-imports": "error",
  "@typescript-eslint/restrict-template-expressions": "error",
};

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    // Default block: all API TypeScript sources.
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      ...coreSafetyRules,
      ...importRules,
      ...typescriptErrorRules,
      // Platform: Express only (not Fastify).
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/platform-fastify",
              message: "Use @nestjs/platform-express (Express).",
            },
          ],
        },
      ],
      // Layer boundaries: core ↔ features, feature ↔ feature.
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/core",
              from: "./src/features",
              message:
                "core/ must not import features/ — use core/plugins contracts (planned).",
            },
            ...featureCrossImportZones(),
          ],
        },
      ],
    },
  },
  {
    // Controllers: thin HTTP layer — no Prisma or database imports.
    files: ["**/*.controller.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/platform-fastify",
              message: "Use @nestjs/platform-express (Express).",
            },
            {
              name: "@aucobot/database",
              message: "Controllers delegate to services — do not import database.",
            },
          ],
          patterns: [
            {
              group: ["**/database/prisma.service", "**/prisma.service"],
              message: "Controllers delegate to services — do not use PrismaService.",
            },
          ],
        },
      ],
    },
  },
  {
    // DTOs: Zod/class validation only — no DI or persistence.
    files: ["**/dto/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nestjs/common",
              importNames: ["Injectable"],
              message: "DTO files are validation-only — no @Injectable.",
            },
            {
              name: "@aucobot/database",
              message: "DTO files must not import database.",
            },
          ],
          patterns: [
            {
              group: ["**/database/prisma.service", "**/prisma.service"],
              message: "DTO files must not import PrismaService.",
            },
          ],
        },
      ],
    },
  },
  {
    // Express middleware may mutate req/res — allow param property reassignment.
    files: ["**/*.middleware.ts"],
    rules: {
      "no-param-reassign": ["error", { props: false }],
    },
  },
  {
    // Tests: console allowed for debugging output.
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    // This config file is plain JS — relax rules that do not apply.
    files: ["eslint.config.mjs"],
    rules: {
      "no-console": "off",
      "import/order": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
