import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{ files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
	{
		ignores: ['node_modules/', 'dist/', '.nuxt/', '*.config.js', '.output/']
	},
	{
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'warn',
			'vue/component-tags-order': [
				'error',
				{
					order: ['script', 'template', 'style']
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-explicit-any': 'off', // Allow the use of `any` type
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused variables starting with "_"
			'nuxt/no-cjs-in-config': 'off',
			'nuxt/no-undef': 'off',
			'no-undef': 'off'
		}
	}
];
