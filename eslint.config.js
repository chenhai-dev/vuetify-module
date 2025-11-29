import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt()
  .append({
    ignores: [
        '**/*.d.ts',
        '**/*.d.ts.map',

        // build output
        'dist/',
        '.output/',

        // Nuxt build dirs
        '.nuxt/',
        'playground/.nuxt/',

        // Node modules
        'node_modules/',
    ],
  })
    .overrideRules({
        'vue/multi-word-component-names': 'off'
    })
