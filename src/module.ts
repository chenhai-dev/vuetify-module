import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  extendViteConfig,
  addImportsDir, addVitePlugin, addTemplate, useLogger, addComponentsDir, addImports,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defu } from 'defu'
import type { ModuleOptions, VuetifyOptions } from './types'
import { addIconStyles } from './utils'
import { generateVuetifyConfigTemplate, setVuetifyRuntimeConfig } from './utils/module'

// Re-export types
export type { ModuleOptions } from './types'

/**
 * Default Vuetify configuration optimized for performance
 */
const defaultVuetifyOptions: VuetifyOptions = {
  aliases: {},
  defaults: {
    global: {
      ripple: true,
    },
    // Buttons
    VBtn: {
      color: 'primary',
      density: 'default',
      variant: 'elevated',
    },
    // Cards
    VCard: {
      variant: 'elevated',
    },
    // Form inputs - compact and consistent
    VTextField: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VTextarea: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VSelect: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VCombobox: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    VCheckbox: {
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VRadio: {
      color: 'primary',
      density: 'comfortable',
    },
    VRadioGroup: {
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSwitch: {
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VFileInput: {
      density: 'comfortable',
      variant: 'outlined',
      hideDetails: 'auto',
    },
    // Lists
    VList: {
      density: 'comfortable',
    },
    VListItem: {
      density: 'comfortable',
    },
    // Tabs
    VTab: {
      sliderColor: 'primary',
    },
    VTabs: {
      color: 'primary',
    },
    // Data tables
    VDataTable: {
      fixedHeader: true,
    },
    // Dialogs
    VDialog: {
      scrim: 'rgba(0, 0, 0, 0.5)',
    },
    // Navigation
    VNavigationDrawer: {
      touchless: false,
    },
    // Tooltips
    VTooltip: {
      location: 'top',
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // Primary colors
          'primary': '#1976D2',
          'primary-darken-1': '#1565C0',
          'secondary': '#424242',
          'secondary-darken-1': '#3d3d3d',
          // Semantic colors
          'accent': '#82B1FF',
          'error': '#FF5252',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FB8C00',
          // Surface colors
          'background': '#FAFAFA',
          'surface': '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-variant': '#E0E0E0',
          'on-surface-variant': '#424242',
        },
      },
      dark: {
        dark: true,
        colors: {
          // Color
          'primary': '#2196F3',
          'primary-darken-1': '#1E88E5',
          'secondary': '#424242',
          'secondary-darken-1': '#3d3d3d',
          'accent': '#FF4081',
          'error': '#FF5252',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FB8C00',
          // Background
          'background': '#121212',
          'surface': '#212121',
          'surface-bright': '#2C2C2C',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {},
  },
  locale: {
    locale: 'en',
    fallback: 'en',
  },
  ssr: true,
}

const logger = useLogger(`nuxt:vuetify-module`)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify-module',
    configKey: 'vuetify',
    // strictly require Nuxt 4 compatible versions
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  // Default configuration of Nuxt Module
  defaults: {
    vuetifyOptions: defaultVuetifyOptions,
    // Style options
    styles: true,
    disableVuetifyStyles: false,
    // automatic tree-shaking Vuetify components and directives, also include labs or Ignoring components or directives
    autoImport: {
      labs: true,
    },
    // Feature options
    importComposables: true,
    prefixComposables: true,
    transformAssetUrls: true,

    // Theme persistence
    themePersistence: {
      enabled: true,
      storage: 'cookie',
      key: 'nuxt-vuetify-theme',
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      },
    },

    // Performance
    prefetch: true,
    preload: true,
  },
  // Hooks shorthand
  hooks: {},
  // Setup function
  async setup(options: ModuleOptions, nuxt: Nuxt) {
    const resolver = createResolver(import.meta.url)
    const startTime = Date.now()

    logger.info('Starting Vuetify module setup...')

    // Validate icon set
    const validIconSets = ['mdi', 'mdi-svg', 'fa', 'fa-svg', 'md']
    const iconSet = options.vuetifyOptions?.icons?.defaultSet
    if (iconSet && !validIconSets.includes(iconSet)) {
      logger.warn(`Unknown icon set: ${iconSet}. Valid options: ${validIconSets.join(', ')}`)
    }

    /* -----------------------------------------------
     * Runtime Configuration
     * --------------------------------------------- */
    setVuetifyRuntimeConfig(options, nuxt, logger)

    // Generate Vuetify configuration template
    addTemplate({
      filename: 'vuetify-options.mjs',
      getContents: () => generateVuetifyConfigTemplate(options),
    })

    /* -----------------------------------------------
     * disable inline styles when SSR enabled
     * --------------------------------------------- */
    if (options.vuetifyOptions.ssr && !!options.styles && typeof options.styles === 'object') {
      nuxt.options.features.inlineStyles = false
    }

    /* -----------------------------------------------
     * Add Vuetify styles
     * --------------------------------------------- */

    if (!options.disableVuetifyStyles) {
      nuxt.options.css ??= []
      nuxt.options.css.unshift('vuetify/styles')
    }

    /* -----------------------------------------------
     * Add icon font CSS if not using SVG
     * --------------------------------------------- */
    addIconStyles(nuxt, options.vuetifyOptions?.icons)

    /* -----------------------------------------------
     * Auto Add Styles
     * --------------------------------------------- */
    // nuxt.options.css.push(resolver.resolve('./runtime/styles/main.scss'))

    /* -----------------------------------------------
     * Nuxt - Build Config
     * --------------------------------------------- */
    nuxt.options.build.transpile ||= []
    nuxt.options.build.transpile.push('vue')
    nuxt.options.build.transpile.push('vuetify')
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    /* -----------------------------------------------
     * Nuxt - Vuetify transformAssetUrls
     * --------------------------------------------- */
    if (options.transformAssetUrls) {
      nuxt.options.vite.vue = nuxt.options.vite.vue || {}
      nuxt.options.vite.vue.template = defu(nuxt.options.vite.vue.template || {}, {
        transformAssetUrls: transformAssetUrls,
      })
    }

    /* -----------------------------------------------
     * Add type declarations (Nuxt 4 has improved TypeScript support)
     * --------------------------------------------- */
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vuetify' })
      references.push({ path: resolver.resolve('./types.ts') })
    })

    /* -----------------------------------------------
     * Add runtime plugin
     * --------------------------------------------- */
    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'all',
    })

    /* -----------------------------------------------
     * Auto Composables Import
     * --------------------------------------------- */
    // addImportsDir(resolver.resolve('runtime/composables'))
    addImports({
      name: 'useVuetify',
      as: 'useVuetify',
      from: resolver.resolve('runtime/composables'),
    })
    if (options.importComposables) {
      // Add Vuetify composables directly
      nuxt.hook('imports:extend', (imports) => {
        const vuetifyComposables = ['useDate', 'useDefaults', 'useDisplay', 'useGoTo', 'useHotkey', 'useLayout', 'useLocale', 'useMask', 'useRtl', 'useTheme']
        vuetifyComposables.forEach((name) => {
          imports.push({ name, from: 'vuetify' })
        })
      })
    }
    /* -----------------------------------------------
     * Auto Component Import (VBtn, VCard, etc.)
     * --------------------------------------------- */
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'V',
    })

    /* -----------------------------------------------
     * Vite for Vuetify
     * --------------------------------------------- */
    extendViteConfig((config) => {
      // Optimize
      // config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })
      config.optimizeDeps = defu(config.optimizeDeps, { include: ['vuetify'] })

      // Prevent externalizing Vuetify for SSR/build
      if (options.vuetifyOptions?.ssr) {
        config.ssr ||= {}
        config.ssr.noExternal = [
          ...(Array.isArray(config.ssr.noExternal)
            ? config.ssr.noExternal
            : config.ssr.noExternal && typeof config.ssr.noExternal !== 'boolean'
              ? [config.ssr.noExternal]
              : []
          ),
          'vuetify',
        ]
      }
    })

    /* -----------------------------------------------
     * Auto Tree-Shaking (recommended by Vuetify team)
     * --------------------------------------------- */
    if (options.autoImport) {
      addVitePlugin(vuetify({
        autoImport: options.autoImport,
        styles: options.styles || true,
      }), { prepend: true })
    }

    // Nitro config
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.externals = nitroConfig.externals || {}
      nitroConfig.externals.inline = nitroConfig.externals.inline || []
      nitroConfig.externals.inline.push('vuetify')
    })

    /* -----------------------------------------------
     * Prefetch & Preload Vuetify chunks for faster navigation
     * --------------------------------------------- */
    if (options.prefetch || options.preload) {
      nuxt.hook('build:manifest', (manifest) => {
        for (const key in manifest) {
          const entry = manifest[key]
          if (entry?.file?.includes('vuetify')) {
            if (options.prefetch) entry.prefetch = true
            if (options.preload) entry.preload = true
          }
        }
      })
    }

    // Log completion time in debug mode
    logger.info(`Vuetify module setup completed in ${Date.now() - startTime}ms`)
  },
})
