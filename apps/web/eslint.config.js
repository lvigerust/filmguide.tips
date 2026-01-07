import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },

		rules: {
			// Modern JavaScript
			'no-var': 'error', // Use let/const instead of var
			'prefer-template': 'warn', // `Hello ${name}` over 'Hello ' + name
			'object-shorthand': 'warn', // { x } over { x: x }
			'func-style': ['warn', 'expression', { allowArrowFunctions: true }], // const fn = () => {} over function fn() {}
			'prefer-destructuring': ['warn', { array: false, object: true }], // const { x } = obj over const x = obj.x

			// Code Quality
			eqeqeq: ['error', 'always'], // === over ==
			'no-undef': 'off', // Disabled for TypeScript (handled by tsc)

			// TypeScript
			'@typescript-eslint/no-explicit-any': 'error', // Never use any
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }], // import type {} from
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' } // Prefix unused with _
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
