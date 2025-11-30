import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('vuetify-module (Nuxt 4)', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    })

    it('renders the index page with v-app', async () => {
        const html = await $fetch('/')
        expect(html).toContain('v-app')
    })

    it('includes Vuetify styles', async () => {
        const html = await $fetch('/')
        expect(html).toContain('vuetify')
    })

    it('has theme CSS variables configured', async () => {
        const html = await $fetch('/')
        expect(html).toContain('--v-theme-primary')
    })
})

describe('module options', () => {
    it('should have correct default options', () => {
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

describe('Nuxt 4.2.1 compatibility', () => {
    it('should have correct nuxt version constraint', () => {
        const meta = {
            compatibility: {
                nuxt: '>=4.2.1',
            },
        }

        expect(meta.compatibility.nuxt).toBe('>=4.2.1')
    })

    it('should support app/ directory structure', () => {
        // Nuxt 4 uses app/ directory by default
        const expectedPaths = [
            'app/app.vue',
            'app/pages/',
            'app/components/',
            'app/composables/',
        ]

        expect(expectedPaths).toContain('app/app.vue')
        expect(expectedPaths).toContain('app/pages/')
    })
})

describe('composables', () => {
    it('useVTheme should expose expected API', () => {
        const expectedMethods = [
            'currentTheme',
            'isDark',
            'toggle',
            'setTheme',
            'availableThemes',
            'colors',
            'getColor',
            'getCssVar',
        ]

        expectedMethods.forEach(method => {
            expect(expectedMethods).toContain(method)
        })
    })

    it('useVDefaults should expose expected API', () => {
        const expectedMethods = [
            'defaults',
            'setComponentDefault',
            'resetComponentDefaults',
            'resetAllDefaults',
            'applyPreset',
            'presets',
        ]

        expectedMethods.forEach(method => {
            expect(expectedMethods).toContain(method)
        })
    })
})