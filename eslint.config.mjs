import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...compat.extends('airbnb-base'),
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    rules: {
      "no-param-reassign": [2, { "props": false }]
    }
  },
  {
    ignores: ['eslint.config.mjs', 'node_modules', 'src/vite-env.d.ts'],
  }
);