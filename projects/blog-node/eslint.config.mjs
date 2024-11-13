import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
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
    ]
  }
]
