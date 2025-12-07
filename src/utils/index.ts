import type { Nuxt } from '@nuxt/schema'
import type { VuetifyOptions } from '../types'
import type { ModuleOptions } from '../module'

/**
 * Add icon CSS based on icon configuration
 */
export function addIconStyles(nuxt: Nuxt, icons?: VuetifyOptions['icons']) {
  if (!icons) return

  const iconCssMap: Record<string, string> = {
    mdi: '@mdi/font/css/materialdesignicons.css',
    fa: '@fortawesome/fontawesome-free/css/all.css',
    md: 'material-design-icons-iconfont/dist/material-design-icons.css',
  }

  const defaultSet = icons.defaultSet || 'mdi'
  const cssPath = iconCssMap[defaultSet]

  if (cssPath && !nuxt.options.css.includes(cssPath)) {
    nuxt.options.css.push(cssPath)
  }

  // Also check for additional icon sets
  if (icons.sets) {
    Object.keys(icons.sets).forEach((setName) => {
      const setCss = iconCssMap[setName]
      if (setCss && !nuxt.options.css.includes(setCss)) {
        nuxt.options.css.push(setCss)
      }
    })
  }
}

/**
 * Generate Vuetify config template for virtual module
 */
export function generateVuetifyConfigTemplate(options: ModuleOptions): string {
  return `
// Auto-generated Vuetify configuration
export const vuetifyOptions = ${JSON.stringify(options.vuetifyOptions, null, 2)}
export const moduleOptions = {
  autoImports: ${options.autoImport},
  importComposables: ${options.importComposables},
  styles: ${JSON.stringify(options.styles)},
}
`
}
// Helper: always returns an array of strings/regexes
export const normalizeNoExternal = (value: unknown): (string | RegExp)[] => {
  if (value === true) return [] // true = no externalizing restrictions
  if (typeof value === 'string') return [value]
  if (value instanceof RegExp) return [value]
  if (Array.isArray(value)) return value
  return []
}

/**
 * Create custom Vuetify options by merging with defaults
 */
export function createVuetifyOptions(
  defaultOptions: VuetifyOptions,
  customOptions: Partial<VuetifyOptions> = {},
): VuetifyOptions {
  return {
    ...defaultOptions,
    ...customOptions,
    defaults: {
      ...defaultOptions.defaults,
      ...customOptions.defaults,
    },
    theme: {
      ...defaultOptions.theme,
      ...customOptions.theme,
      themes: {
        ...defaultOptions.theme?.themes,
        ...customOptions.theme?.themes,
      },
    },
    icons: {
      ...defaultOptions.icons,
      ...customOptions.icons,
    },
    locale: {
      ...defaultOptions.locale,
      ...customOptions.locale,
    },
  }
}
