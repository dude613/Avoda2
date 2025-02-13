import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginNuxt from 'eslint-plugin-nuxt';
import vueParser from 'vue-eslint-parser';  // ✅ Required for Vue files

export default [
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,  // ✅ Use Vue parser for Vue files
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue: pluginVue,
      nuxt: pluginNuxt,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginNuxt.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/component-tags-order': [
        'error',
        { order: ['script', 'template', 'style'] },
      ],
      '@/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'nuxt/no-cjs-in-config': 'warn',
      'nuxt/no-undef': 'warn',
      'no-undef': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,  // ✅ Ensure Vue parser is applied to .vue files
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,  // ✅ Ensure TypeScript parser for .ts files
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.nuxt/',
      '*.config.{js,cjs}',
      '.output/',
    ],
  },
];
