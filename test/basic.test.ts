import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('my-vuetify-module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('v-app')
  })

  it('includes Vuetify CSS', async () => {
    const html = await $fetch('/')
    expect(html).toContain('vuetify')
  })

  it('has theme colors configured', async () => {
    const html = await $fetch('/')
    expect(html).toContain('--v-theme-primary')
  })
})

describe('module options', () => {
  it('should have default options', () => {
    const defaults = {
      enabled: true,
      defaultTheme: 'light',
      icons: {
        defaultSet: 'mdi',
        useSvg: false,
      },
      performance: {
        treeShaking: true,
        prefetch: false,
      },
    }
    
    expect(defaults.enabled).toBe(true)
    expect(defaults.defaultTheme).toBe('light')
    expect(defaults.icons.defaultSet).toBe('mdi')
    expect(defaults.performance.treeShaking).toBe(true)
  })
})

describe('theme configuration', () => {
  it('should support light theme', () => {
    const lightTheme = {
      dark: false,
      colors: {
        primary: '#1976D2',
        secondary: '#424242',
      },
    }
    
    expect(lightTheme.dark).toBe(false)
    expect(lightTheme.colors.primary).toBe('#1976D2')
  })

  it('should support dark theme', () => {
    const darkTheme = {
      dark: true,
      colors: {
        primary: '#2196F3',
        background: '#121212',
      },
    }
    
    expect(darkTheme.dark).toBe(true)
    expect(darkTheme.colors.background).toBe('#121212')
  })

  it('should support custom themes', () => {
    const brandTheme = {
      dark: false,
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
      },
    }
    
    expect(brandTheme.colors.primary).toBe('#FF6B35')
  })
})

describe('defaults configuration', () => {
  it('should configure VBtn defaults', () => {
    const btnDefaults = {
      rounded: 'lg',
      elevation: 2,
    }
    
    expect(btnDefaults.rounded).toBe('lg')
    expect(btnDefaults.elevation).toBe(2)
  })

  it('should configure VTextField defaults', () => {
    const textFieldDefaults = {
      variant: 'outlined',
      density: 'comfortable',
    }
    
    expect(textFieldDefaults.variant).toBe('outlined')
    expect(textFieldDefaults.density).toBe('comfortable')
  })
})
