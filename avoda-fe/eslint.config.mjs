import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.nuxt/',
      '*.config.{js, cjs}',
      '.output/',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/component-tags-order': [
        'error',
        { order: ['script', 'template', 'style'] },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'nuxt/no-cjs-in-config': 'off',
      'nuxt/no-undef': 'off',
      'no-undef': 'off',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue: pluginVue,
      nuxt: true,
    },
  },
];
