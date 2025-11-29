import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.myVuetify

  // Build theme configuration
  const themes: Record<string, any> = {}
  
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
  const iconConfig: any = {
    defaultSet: config.icons?.defaultSet || 'mdi',
    aliases: {
      ...aliases,
      ...(config.icons?.aliases || {}),
    },
    sets: {
      mdi,
    },
  }

  // Create Vuetify instance
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: config.defaultTheme || 'light',
      themes,
    },
    defaults: config.defaults || {},
    icons: iconConfig,
    // Blueprint preset
    ...(config.blueprint ? { blueprint: getBlueprint(config.blueprint) } : {}),
  })

  // Provide Vuetify to the app
  nuxtApp.vueApp.use(vuetify)

  // Expose Vuetify instance
  return {
    provide: {
      vuetify,
    },
  }
})

// Get blueprint preset
function getBlueprint(name: string) {
  // Blueprints can be imported from vuetify/blueprints
  // For now, return undefined - user can extend this
  return undefined
}
