import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "no-console": "off",
      "import/extensions": ["error", "ignorePackages"],
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "next" }],
      "import/prefer-default-export": "off",
      "prettier/prettier": [
        "warn",
        {
          singleQuote: false,
          DoubleQuote: true,
          semi: true,
          tabWidth: 2,
        },
      ],
    },
  },
];
