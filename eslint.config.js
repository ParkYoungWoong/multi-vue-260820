import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { globalIgnores } from 'eslint/config'

export default defineConfigWithVueTs(
  { files: ['**/*.{vue,ts,mts,tsx}'] },
  globalIgnores(['**/dist/**']),
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  prettierRecommended,
  {
    rules: {
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/comment-directive': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off'
    }
  }
)
