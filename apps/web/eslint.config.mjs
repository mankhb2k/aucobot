// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

const appLayerFiles = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "hooks/**/*.{ts,tsx}",
  "utils/**/*.{ts,tsx}",
];

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
    "public/**",
  ],
}, eslint.configs.recommended, ...nextVitals, ...tseslint.configs.recommendedTypeChecked, {
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
  files: appLayerFiles,
  rules: appLayerRestrictions,
}, {
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
  files: ["**/*.spec.ts", "**/*.test.ts", "**/*.test.tsx"],
  rules: {
    "no-restricted-globals": "off",
    "no-restricted-imports": "off",
    "import/first": "off",
  },
}, {
  files: ["eslint.config.mjs"],
  rules: {
    "no-console": "off",
    "import/order": "off",
    "@typescript-eslint/no-require-imports": "off",
  },
}, storybook.configs["flat/recommended"]);
