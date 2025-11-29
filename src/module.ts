import {
  addComponent,
  addImports,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  addVitePlugin,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { ThemeDefinition } from 'vuetify'

// Module options interface
export interface ModuleOptions {
  /**
   * Enable/disable the module
   * @default true
   */
  enabled?: boolean

  /**
   * Default theme name
   * @default 'light'
   */
  defaultTheme?: string

  /**
   * Custom theme definitions
   */
  themes?: {
    light?: Partial<ThemeDefinition>
    dark?: Partial<ThemeDefinition>
    [key: string]: Partial<ThemeDefinition> | undefined
  }

  /**
   * Default component props
   */
  defaults?: Record<string, Record<string, unknown>>

  /**
   * Icon configuration
   */
  icons?: {
    /**
     * Default icon set
     * @default 'mdi'
     */
    defaultSet?: 'mdi' | 'fa' | 'mdi-svg' | string
    
    /**
     * Custom icon aliases
     */
    aliases?: Record<string, string>

    /**
     * Use SVG icons for better performance
     * @default false
     */
    useSvg?: boolean
  }

  /**
   * SASS/SCSS customization
   */
  styles?: {
    /**
     * Path to custom SASS variables file
     */
    configFile?: string
  }

  /**
   * SSR configuration
   */
  ssr?: {
    clientWidth?: number
    clientHeight?: number
  }

  /**
   * Performance optimizations
   */
  performance?: {
    /**
     * Enable tree shaking
     * @default true
     */
    treeShaking?: boolean

    /**
     * Prefetch components
     * @default false
     */
    prefetch?: boolean
  }

  /**
   * Blueprint preset name
   */
  blueprint?: 'md1' | 'md2' | 'md3'

  /**
   * Enable lab components (experimental)
   * @default false
   */
  labComponents?: boolean
}

// Module hooks interface
export interface ModuleHooks {
  'my-vuetify:config': (config: ResolvedConfig) => void | Promise<void>
}

// Resolved configuration
interface ResolvedConfig {
  themes: ModuleOptions['themes']
  defaults: ModuleOptions['defaults']
  icons: ModuleOptions['icons']
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-vuetify-module',
    configKey: 'myVuetify',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  // Default configuration
  defaults: {
    enabled: true,
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#212121',
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
      },
      VCard: {
        rounded: 'lg',
      },
      VTextField: {
        variant: 'outlined',
      },
    },
    icons: {
      defaultSet: 'mdi',
      useSvg: false,
    },
    ssr: {
      clientWidth: 1920,
      clientHeight: 1080,
    },
    performance: {
      treeShaking: true,
      prefetch: false,
    },
    labComponents: false,
  },

  // Setup function
  async setup(options, nuxt) {
    // Skip if disabled
    if (!options.enabled) {
      return
    }

    const resolver = createResolver(import.meta.url)

    // Resolve configuration
    const resolvedConfig: ResolvedConfig = {
      themes: options.themes,
      defaults: options.defaults,
      icons: options.icons,
    }

    // Call custom hook for config modification
    await nuxt.callHook('my-vuetify:config', resolvedConfig)

    // Expose options to runtime config
    nuxt.options.runtimeConfig.public.myVuetify = defu(
      nuxt.options.runtimeConfig.public.myVuetify || {},
      {
        defaultTheme: options.defaultTheme,
        themes: resolvedConfig.themes,
        defaults: resolvedConfig.defaults,
        icons: resolvedConfig.icons,
        ssr: options.ssr,
        blueprint: options.blueprint,
        labComponents: options.labComponents,
      }
    )

    // Add Vuetify to transpile
    nuxt.options.build.transpile.push('vuetify')

    // Configure Vite for Vuetify
    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('vuetify')

      // SASS configuration
      config.css = config.css || {}
      config.css.preprocessorOptions = config.css.preprocessorOptions || {}
      config.css.preprocessorOptions.scss = {
        api: 'modern-compiler',
        ...config.css.preprocessorOptions.scss,
      }

      // Define process.env.DEBUG for Vuetify
      config.define = config.define || {}
      config.define['process.env.DEBUG'] = false
    })

    // Add custom SASS config file if provided
    if (options.styles?.configFile) {
      nuxt.hook('vite:extendConfig', (config) => {
        // Add vite-plugin-vuetify for SASS variable customization
        // This would require the plugin to be installed
      })
    }

    // Add Vuetify CSS
    nuxt.options.css.push('vuetify/styles')

    // Add icon font CSS if not using SVG
    if (!options.icons?.useSvg) {
      nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')
    }

    // Generate Vuetify configuration template
    addTemplate({
      filename: 'vuetify-config.mjs',
      getContents: () => generateVuetifyConfig(options, resolvedConfig),
    })

    // Add the Vuetify plugin
    addPlugin({
      src: resolver.resolve('./runtime/plugins/vuetify'),
      mode: 'all',
    })

    // Add composables
    addImports([
      {
        name: 'useMyVuetifyTheme',
        from: resolver.resolve('./runtime/composables/useMyVuetifyTheme'),
      },
      {
        name: 'useMyVuetifyDefaults',
        from: resolver.resolve('./runtime/composables/useMyVuetifyDefaults'),
      },
    ])

    // Add custom components
    addComponent({
      name: 'VThemeProvider',
      filePath: resolver.resolve('./runtime/components/VThemeProvider.vue'),
    })

    // Add type declarations
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        types: 'vuetify',
      })
    })

    // Log setup completion
    if (nuxt.options.dev) {
      console.log('✅ My Vuetify Module initialized')
    }
  },
})

// Generate Vuetify configuration
function generateVuetifyConfig(
  options: ModuleOptions,
  config: ResolvedConfig
): string {
  return `
// Auto-generated Vuetify configuration
export const vuetifyConfig = {
  defaultTheme: '${options.defaultTheme}',
  themes: ${JSON.stringify(config.themes, null, 2)},
  defaults: ${JSON.stringify(config.defaults, null, 2)},
  icons: {
    defaultSet: '${config.icons?.defaultSet || 'mdi'}',
    aliases: ${JSON.stringify(config.icons?.aliases || {}, null, 2)},
  },
  ssr: ${JSON.stringify(options.ssr, null, 2)},
  blueprint: ${options.blueprint ? `'${options.blueprint}'` : 'undefined'},
}

export default vuetifyConfig
`
}

// Declare module augmentation for Nuxt
declare module '@nuxt/schema' {
  interface NuxtConfig {
    myVuetify?: ModuleOptions
  }
  interface NuxtOptions {
    myVuetify?: ModuleOptions
  }
  interface RuntimeConfig {
    public: {
      myVuetify: {
        defaultTheme: string
        themes: ModuleOptions['themes']
        defaults: ModuleOptions['defaults']
        icons: ModuleOptions['icons']
        ssr: ModuleOptions['ssr']
        blueprint?: string
        labComponents?: boolean
      }
    }
  }
}

declare module '#app' {
  interface NuxtApp {
    $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
  }
}

// Export types
export type { ThemeDefinition }
