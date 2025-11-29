import VuetifyModule from '../../../src/module'

export default defineNuxtConfig({
    // Nuxt 4 compatibility
    compatibilityDate: '2025-01-01',

    modules: [VuetifyModule],

    Vuetify: {
        enabled: true,
        defaultTheme: 'light',
    },
})
