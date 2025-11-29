import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt()
  .append({
    ignores: [
      'dist/',
      'node_modules/',
      '.nuxt/',
      '.output/',
      'playground/.nuxt/',
    ],
  })
