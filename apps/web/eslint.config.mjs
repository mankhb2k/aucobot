/**
 * ESLint flat config for @aucobot/web (Next.js App Router).
 *
 * Layers:
 *  1. Base JS + Next.js core-web-vitals + TypeScript type-checked rules
 *  2. Global rules for all *.ts / *.tsx
 *  3. Layer overrides (app/components/hooks/utils, lib/api, hooks, tests)
 *  4. Storybook recommended rules (flat/recommended)
 *
 * CI: `pnpm --filter @aucobot/web lint:ci`
 *   — lints entire app except story files (see package.json lint:ci script).
 * Build @aucobot/shared before lint so workspace types resolve.
 *
 * Storybook: https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
 */
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

/** UI layers that must use lib/api for HTTP — no raw fetch/axios. */
const appLayerFiles = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "hooks/**/*.{ts,tsx}",
  "utils/**/*.{ts,tsx}",
];

/** Runtime safety and general JS hygiene — applied to all web source files. */
const coreSafetyRules = {
  eqeqeq: ["error", "always", { null: "ignore" }],
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",
  "no-throw-literal": "error",
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
  "prefer-template": "error",
};

/** Import graph hygiene — @/* alias grouped as internal. */
const importRules = {
  "import/no-duplicates": "error",
  "import/no-self-import": "error",
  "import/no-useless-path-segments": "error",
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/order": [
    "warn",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
      pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
      pathGroupsExcludedImportTypes: ["type"],
      alphabetize: { order: "asc", caseInsensitive: true },
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
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: { attributes: false },
    },
  ],
};

/** App UI layers: route HTTP through lib/api, not fetch/axios directly. */
const appLayerRestrictions = {
  "no-restricted-globals": [
    "error",
    {
      name: "fetch",
      message: "Use lib/api/* or lib/http/server-api — not raw fetch in app/components/hooks/utils.",
    },
  ],
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          name: "axios",
          message: "Use lib/api/* — not raw axios in app/components/hooks/utils.",
        },
      ],
    },
  ],
};

export default tseslint.config({
  ignores: [
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "public/**", // static assets (e.g. chat-simulator/app.js) — not TS source
  ],
}, eslint.configs.recommended, ...nextVitals, ...tseslint.configs.recommendedTypeChecked, {
  // Default block: all TypeScript / TSX sources.
  files: ["**/*.{ts,tsx}"],
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
    "@next/next/no-img-element": "error",
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-typos": "warn",
    "react/jsx-no-useless-fragment": "error",
    "react/no-unstable-nested-components": "error",
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    // Prefer named exports; Next.js pages/layouts and Storybook are exempt (see block below).
    "no-restricted-syntax": [
      "error",
      {
        selector: "ExportDefaultDeclaration",
        message:
          "Use named exports — default export only allowed in page.tsx, layout.tsx, and *.stories.tsx.",
      },
    ],
  },
}, {
  // Next.js pages/layouts, Storybook stories, and tool configs require default export.
  files: [
    "**/page.tsx",
    "**/layout.tsx",
    "**/*.stories.tsx",
    "next.config.ts",
    "eslint.config.mjs",
  ],
  rules: {
    "no-restricted-syntax": "off",
  },
}, {
  // app/, components/, hooks/, utils/ — enforce HTTP layer boundaries.
  files: appLayerFiles,
  rules: appLayerRestrictions,
}, {
  // lib/api: client-side API modules — no React, no server-only imports, no UI deps.
  files: ["lib/api/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            message: "lib/api must not import React.",
          },
        ],
        patterns: [
          {
            group: ["**/server-api", "**/server-api.ts"],
            message: "lib/api must not import server-api — use lib/http/fetch-with-auth.",
          },
          {
            group: ["@/hooks/**", "@/components/**", "@/app/**"],
            message: "lib/api must not import hooks, components, or app.",
          },
        ],
      },
    ],
  },
}, {
  // utils/: pure helpers — no React, no upward imports into app/UI layers.
  files: ["utils/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["react", "react/*"],
            message: "utils/ must not import React.",
          },
          {
            group: ["@/hooks/**", "@/components/**", "@/app/**", "@/lib/api/**"],
            message: "utils/ must not import hooks, components, app, or lib/api.",
          },
        ],
      },
    ],
  },
}, {
  // hooks/: data/orchestration — may call lib/api, must not import components or app routes.
  files: ["hooks/**/*.{ts,tsx}"],
  rules: {
    ...appLayerRestrictions,
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "axios",
            message: "Use lib/api/* — not raw axios in hooks.",
          },
        ],
        patterns: [
          {
            group: ["@/components/**", "@/app/**"],
            message: "hooks/ must not import components or app.",
          },
        ],
      },
    ],
  },
}, {
  // Tests: relax layer restrictions for mocks and fixtures.
  files: ["**/*.spec.ts", "**/*.test.ts", "**/*.test.tsx"],
  rules: {
    "no-restricted-globals": "off",
    "no-restricted-imports": "off",
    "import/first": "off",
  },
}, {
  // This config file is plain JS — relax rules that do not apply.
  files: ["eslint.config.mjs"],
  rules: {
    "no-console": "off",
    "import/order": "off",
    "@typescript-eslint/no-require-imports": "off",
  },
}, storybook.configs["flat/recommended"]);
