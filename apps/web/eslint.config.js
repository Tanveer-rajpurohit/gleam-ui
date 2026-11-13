import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["registry/components/**/*.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
];
