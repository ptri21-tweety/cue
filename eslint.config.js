import pluginJs from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['dist/**', 'vscode/**']),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Server and Node scripts

  {
    files: ['server/**/*.{js,ts}', 'offline/**/*.{js,ts}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    // Jest globals
    files: [
      '**/__tests__/**/*.{js,ts,jsx,tsx}',

      '**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    // Custom rules
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: 'warn',
      curly: ['warn', 'multi-or-nest'],
    },
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...hooksPlugin.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
]);
