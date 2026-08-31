// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = defineConfig([
  expoConfig,
  {
    files: ["api/**/*.{js,ts}", "*.config.js", "scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      // Disable noisy import default naming rule
      "import/no-named-as-default": "off",

      // Disable default unused-vars in favor of unused-imports
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Auto-remove unused imports and warn on unused vars
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Import and export sorting
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Side effect imports (e.g. polyfills, CSS/styles)
            ["^\\u0000"],
            // Node.js built-ins prefix
            ["^node:"],
            // React and React Native related packages first, then Expo, then external libraries
            ["^react$", "^react-native$", "^react", "^expo", "^@?\\w"],
            // Internal path aliases (e.g. `@/components`, `@/app`, etc.)
            ["^@/"],
            // Relative imports: parent imports first, then sibling/current directory imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
    },
  },
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*", "scripts/*"],
  },
]);


