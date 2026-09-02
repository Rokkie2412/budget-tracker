// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      // Disable noisy import default naming rule
      "import/no-named-as-default": "off",
      "import/no-unresolved": "off",

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
            // 1. Side effect imports (e.g. polyfills, global CSS)
            ["^\\u0000"],
            // 2. Library luar (npm packages: React, React Native, Expo, Lucide, SWR, dll.)
            ["^node:", "^(?!(assets|components|src)(/|$))@?\\w"],
            // 3. Import internal dari folder berbeda (`@/...`, `assets/...`, `components/...`, `src/...`, `../...`)
            ["^@/", "^(assets|components|src)(/|$)", "^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // 4. Import internal dari folder yang sama (`./...`)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // 5. Style imports (.css, .scss)
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


