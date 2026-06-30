import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // eslint-plugin-react v7.x uses APIs removed in ESLint 10
    rules: {
      "react/display-name": "off",
    },
  },
  {
    // Route-colocated components use underscore prefix (_ComponentName.tsx)
    // which triggers false positives for react-hooks/rules-of-hooks
    files: ["src/app/**/_*.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
]);

export default eslintConfig;
