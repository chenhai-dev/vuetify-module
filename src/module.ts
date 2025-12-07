import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  extendViteConfig,
  extendWebpackConfig,
  addImportsDir, addVitePlugin, addTemplate, useLogger, addComponentsDir,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import vuetify from 'vite-plugin-vuetify'
import { defu } from 'defu'
import type { ModuleOptions, VuetifyOptions, VuetifyRuntimeConfig } from './types'
import { addIconStyles, generateVuetifyConfigTemplate, normalizeNoExternal } from './utils'

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
  locale: {
    locale: 'en',
    fallback: 'en',
    // messages: { en, km },
  },
  ssr: true,
}

const logger = useLogger(`nuxt:vutify-module`)

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
    // autoImport: true,
    autoImport: {
      labs: true,
    },
    // Feature options
    importComposables: true,
    prefixComposables: true,
    transformAssetUrls: true,
    // Performance
    prefetch: true,
    preload: true,
  },
  onInstall(nuxt) {
    // This runs only when the module is first installed
    console.log('Setting up my-awesome-module for the first time!')

    console.log(nuxt)

    // You might want to:
    // - Create initial configuration files
    // - Set up database schemas
    // - Display welcome messages
    // - Perform initial data migration
  },
  // Hooks shorthand
  hooks: {},
  // Setup function
  async setup(options: ModuleOptions, nuxt: Nuxt) {
    const resolver = createResolver(import.meta.url)
    const startTime = Date.now()

    logger.info('Starting Vuetify module setup...')

    /* -----------------------------------------------
     * Emit user-extensible hook: vuetify:register
     * --------------------------------------------- */
    try {
      await nuxt.hooks.callHook('vuetify:registerModule', (config: Pick<ModuleOptions, 'vuetifyOptions'>) => {
        console.log(config)
      })
      logger.info('vuetify:register hook completed')
    }
    catch (error) {
      logger.warn('Error in vuetify:register hook:', error)
    }

    /* -----------------------------------------------
     * Runtime Configuration
     * --------------------------------------------- */
    const runtimeConfig: VuetifyRuntimeConfig = {
      aliases: options.vuetifyOptions.aliases!,
      defaults: options.vuetifyOptions.defaults!,
      theme: options.vuetifyOptions.theme!,
      icons: options.vuetifyOptions.icons!,
      locale: options.vuetifyOptions.locale!,
      ssr: options.vuetifyOptions.ssr!,
    }
    nuxt.options.runtimeConfig.public.vuetify = defu(
      nuxt.options.runtimeConfig.public.vuetify || {},
      runtimeConfig,
    )

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
     * Auto Styles
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
     * Add runtime plugin
     * --------------------------------------------- */
    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'all',
    })

    /* -----------------------------------------------
     * Auto Composables Import
     * --------------------------------------------- */
    addImportsDir(resolver.resolve('runtime/composables'))
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
     * Add icon font CSS if not using SVG
     * --------------------------------------------- */
    addIconStyles(nuxt, options.vuetifyOptions?.icons)

    /* -----------------------------------------------
     * Optimize Vite for Vuetify
     * --------------------------------------------- */
    extendViteConfig((config) => {
      config.optimizeDeps ||= {}
      config.optimizeDeps.include ||= []
      if (!config.optimizeDeps.include.includes('vuetify')) {
        config.optimizeDeps.include.push('vuetify')
      }
      // Enable CSS code splitting for faster initial load
      config.build ||= {}
      config.build.cssCodeSplit = true
    })

    /* -----------------------------------------------
     * Auto Tree-Shaking (recommended by Vuetify team)
     * --------------------------------------------- */
    if (options.autoImport) {
      addVitePlugin(vuetify({
        autoImport: options.autoImport,
        styles: options.styles,
      }), {
        prepend: true,
      })
    }

    /* -----------------------------------------------
     * Nuxt - Prevent externalizing Vuetify for SSR/build
     * --------------------------------------------- */
    if (options.vuetifyOptions?.ssr) {
      extendViteConfig((config) => {
        config.ssr ||= {}
        config.ssr.noExternal = [...normalizeNoExternal(config.ssr.noExternal), 'vuetify']
      })
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

    // Add type declarations (Nuxt 4 has improved TypeScript support)
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vuetify' })
      references.push({ path: resolver.resolve('./types.ts') })
    })
    // Log completion time in debug mode
    logger.info(`Vuetify module setup completed in ${Date.now() - startTime}ms`)
  },
})
