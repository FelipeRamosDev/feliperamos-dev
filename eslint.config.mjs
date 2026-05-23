import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Disable react-hooks v5 rules that are new with Next.js 16 / React 19 and
  // produce false positives for valid patterns in this codebase.
  {
    rules: {
      // Async server components (RSC) render JSX in try/catch — not a hooks concern.
      'react-hooks/error-boundaries': 'off',
      // Synchronous setState at the start of an effect is a common loading/init
      // pattern that works correctly; too many false positives.
      'react-hooks/set-state-in-effect': 'off',
      // Refs are intentionally used for non-reactive values (sockets, timers, counters).
      'react-hooks/refs': 'off',
      // React Compiler memoization hint — not applicable unless Compiler is active.
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
  // Project overrides
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: {
      // Allow flexible mocking & intentional looseness in test code
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      // Tests may purposefully use raw img tags / html snippets
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
