import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import {createVuetify} from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type {IconOptions, ModuleOptions} from "../types";
import type {DisplayOptions} from "vuetify/lib/composables/display";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig().public.vuetify

    // Build theme configuration
    const themes: ModuleOptions['themes'] = {}

    if (config.themes) {
        for (const [name, theme] of Object.entries(config.themes)) {
            if (theme) {
                themes[name] = {
                    dark: theme.dark ?? name === 'dark',
                    colors: theme.colors || {},
                    variables: theme.variables || {},
                }
            }
        }
    }

    // Build icon configuration
    const iconConfig: IconOptions = {
        defaultSet: config.icons?.defaultSet || 'mdi',
        aliases: {
            ...aliases,
            ...(config.icons?.aliases || {}),
        },
        sets: {
            mdi,
        },
    }

    // Build component aliases
    const componentAliases = config.aliases || {}

    // Build display configuration for SSR
    // @see https://vuetifyjs.com/en/features/display-and-platform/#ssr
    const displayConfig:DisplayOptions = {
        mobileBreakpoint: 'sm',
        thresholds: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
            xxl: 2560,
        },
    }

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
        display: displayConfig,
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
