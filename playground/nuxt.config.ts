// Nuxt 4 configuration
import {vuetify} from "./shared/config/vuetify";

export default defineNuxtConfig({
    // Nuxt 4 compatibility
    compatibilityDate: '2025-11-15',

    modules: [
        '../src/module'
    ],

    ssr:false,
    devtools: { enabled: false },

    // Configure the custom Vuetify module
    vuetify: vuetify,

    // Nuxt 4 experimental features
    experimental: {
        payloadExtraction: true,
    },
})