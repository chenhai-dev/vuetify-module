import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('vuetify module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders components with auto-import', async () => {
    const html = await $fetch('/')
    expect(html).toContain('v-btn')
  })

  it('includes Vuetify styles', async () => {
    const html = await $fetch('/')
    expect(html).toContain('vuetify')
  })

  it('provides $vuetify instance', async () => {
    // Test Vuetify instance is available
  })

  it('supports directives auto-import', async () => {
    const html = await $fetch('/directives')
    expect(html).toContain('v-ripple')
  })

  it('supports labs components when enabled', async () => {
    const html = await $fetch('/labs')
    expect(html).toContain('v-date-input')
  })
})
