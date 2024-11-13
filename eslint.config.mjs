import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginReact from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

/** @type {import('eslint').Linter.Config[]} */
export default createConfigForNuxt({
  // options here
})
  .prepend(
    // ...Prepend some flat configs in front
    [
      { files: ['**/*.{js,mjs,cjs,ts,vue,jsx,tsx}'] },
      {
        languageOptions: {
          globals: globals.browser
        }
      },
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      ...pluginVue.configs['flat/essential'],
      {
        files: ['**/*.vue'],
        languageOptions: { parserOptions: { parser: tseslint.parser } }
      },
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
      {
        ignores: [
          '**/logs/',
          '**/*.log',
          '**/*.log*',
          '**/node_modules/',
          '**/.vscode/',
          '**/.husky/',
          '**/.nuxt/',
          '**/.idea/',
          '**/.output/',
          '**/.local/',
          '**/dist/',
          '**/public/',
          '**/*.sh',
          '**/*.md',
          '**/*.woff',
          '**/*.ttf'
        ],
        rules: {
          'no-unused-vars': 'warn'
        }
      }
    ]
  )
  // Override some rules in a specific config, based on their name
  .override('nuxt/typescript/rules', {
    rules: {
      // ...Override rules, for example:
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  })
  .override('nuxt/vue/rules', {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  })
