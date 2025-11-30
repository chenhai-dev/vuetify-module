import VuetifyModule from '../../src/module'
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
    // Nuxt 4 compatibility
    compatibilityDate: '2025-11-15',

    modules: [VuetifyModule],

    vuetify: {
        enabled: true,
        defaultTheme: 'light',
    },
})