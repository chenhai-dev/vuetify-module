// Generate Vuetify configuration
import type {ModuleOptions,VuetifyOptions} from "../types";


// ----------------------------
// Config generator (fixed)
// ----------------------------
export  function generateVuetifyConfig(
    options: ModuleOptions,
    themes: ModuleOptions['themes'],
    config: VuetifyOptions
): string {
    return `
// Auto-generated Vuetify configuration for Nuxt 4
export const vuetifyConfig = {
  defaultTheme: '${options.defaultTheme}',
  themes: ${JSON.stringify(themes, null, 2)},
  aliases: ${JSON.stringify(config.aliases, null, 2)},
  defaults: ${JSON.stringify(config.defaults, null, 2)},
  icons: {
    defaultSet: '${config.icons?.defaultSet || 'mdi'}',
    aliases: ${JSON.stringify(config.icons?.aliases || {}, null, 2)}
  },
  ssr: ${JSON.stringify(options.ssr, null, 2)},
  blueprint: ${options.blueprint ? `'${options.blueprint}'` : 'undefined'},
}

export default vuetifyConfig
`
}