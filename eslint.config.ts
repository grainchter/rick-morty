import eslint from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['e2e/**/*.ts'],
    ...playwrightPlugin.configs['flat/recommended'],
  },
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/dist-ssr',
      '**/coverage',
      '**/playwright-report',
      '**/test-results',
      '**/.vitest-coverage',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/playwright.config.ts',
    ],
  },
);
