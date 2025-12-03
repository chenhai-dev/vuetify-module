import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import {createVuetify} from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type {IconOptions, ModuleOptions} from "../../types";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig().public.vuetify

    // Build icon configuration
    const iconConfig: IconOptions = {
        defaultSet: config.icons?.defaultSet || 'mdi',
        aliases: {
            ...aliases,
            ...(config.icons.aliases || {}),
        },
        sets: {
            mdi,
        },
    }

    // Build component aliases
    const componentAliases = config.aliases || {}

    // Create Vuetify instance with Nuxt 4 SSR support
    const vuetify = createVuetify({
        ssr: config.ssr||true,
        // components,
        // directives,
        aliases: componentAliases,
        theme: {
            defaultTheme: config.defaultTheme || 'light',
            themes,
        },
        defaults: config.defaults || {},
        icons: iconConfig,
        // Build display configuration for SSR
        display: {
            mobileBreakpoint: 'sm',
            thresholds: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
                xxl: 2560,
            },
        },
        blueprint: config.blueprint
    })

    // Provide Vuetify to the Vue app
    nuxtApp.vueApp.use(vuetify)

    // Expose Vuetify instance via provide/inject
    return {
        provide: {
            vuetify,
        },
    }
})
