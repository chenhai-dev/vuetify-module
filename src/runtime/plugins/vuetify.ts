import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import {defineNuxtPlugin,useRuntimeConfig} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    // Build theme configuration
    const themes: Record<string, any> = {}

    if (config.public?.Vuetify?.themes) {
        for (const [name, theme] of Object.entries(config.public.Vuetify.themes)) {
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
    const iconConfig: any = {
        defaultSet: config.public.Vuetify.icons?.defaultSet || 'mdi',
        aliases: {
            ...aliases,
            ...(config.public.Vuetify.icons?.aliases || {}),
        },
        sets: {
            mdi,
        },
    }

    // Create Vuetify instance with Nuxt 4 SSR support
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        theme: {
            defaultTheme: config.public.Vuetify.defaultTheme || 'light',
            themes,
        },
        defaults: config.defaults || {},
        icons: iconConfig,
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
