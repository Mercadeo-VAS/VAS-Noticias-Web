import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		rules: {
			'max-len': ['error', 150],
			'comma-dangle': ['error', 'always-multiline'],
			'eqeqeq': ['error', 'always'],
			'no-unused-expressions': 'error',
			'no-shadow': 'off',
			'prefer-const': 'error',
			'no-var': 'error',
			'curly': ['error', 'all'],
			'object-curly-newline': [
				'error',
				{
					'ObjectExpression': {
						'multiline': true,
						'consistent': true
					},
					'ObjectPattern': {
						'multiline': true
					},
					'ImportDeclaration': {
						'multiline': true
					},
					'ExportDeclaration': {
						'multiline': true
					}
				}
			],
			'object-curly-spacing': 'off',
			'@typescript-eslint/array-type': [
				'error',
				{
					'default': 'array'
				}
			],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					'selector': 'class',
					'format': ['PascalCase']
				},
				{
					'selector': 'interface',
					'format': ['PascalCase'],
					'custom': {
						'regex': '^[A-Z][a-z]+(?:[A-Z][a-z]+)*$',
						'match': true
					}
				},
				{
					'selector': 'typeAlias',
					'format': ['PascalCase']
				},
				{
					'selector': 'typeParameter',
					'format': ['PascalCase'],
					'prefix': ['T']
				},
				{
					'selector': 'property',
					'format': ['camelCase'],
					'modifiers': ['public', 'protected', 'static']
				},
				{
					'selector': 'property',
					'format': ['camelCase'],
					'modifiers': ['private'],
					'leadingUnderscore': 'require'
				},
				{
					'selector': 'method',
					'format': ['camelCase'],
					'modifiers': ['private'],
					'leadingUnderscore': 'require'
				},
				{
					'selector': 'function',
					'format': ['camelCase']
				},
				{
					'selector': 'parameter',
					'format': ['camelCase']
				}
			],
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/typedef': [
				'error',
				{
					'arrayDestructuring': false,
					'objectDestructuring': false,
					'arrowParameter': true,
					'memberVariableDeclaration': false,
					'parameter': true,
					'propertyDeclaration': true
				}
			],
			'perfectionist/sort-imports': [
				'error',
				{
					'order': 'asc',
					'groups': [
						['builtin', 'external'],
						'internal-type',
						'internal',
						['parent-type', 'sibling-type', 'index-type'],
						['parent', 'sibling', 'index'],
						'side-effect',
						'style',
						'object',
						'unknown'
					],
					'newlines-between': 'always',
					'internal-pattern': ['@environments/**', '@shared/**']
				}
			],
			'perfectionist/sort-named-imports': [
				'error',
				{
					'type': 'natural',
					'order': 'asc'
				}
			]
		}
	}
];
