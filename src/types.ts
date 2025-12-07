import type {
  Anchor,
  VuetifyOptions as VOptions, createVuetify,
} from 'vuetify'
import type { HookResult } from '@nuxt/schema'
import type * as Components from 'vuetify/components'
import type * as Directives from 'vuetify/directives'

/**
 * Module-level configuration options
 */

export interface VuetifyModuleOptions {
  /**
   * Enable/disable Vuetify styles
   * - true: Use compiled CSS (default)
   * - 'sass': Use SASS source for customization
   * - false: Disable styles
   * @default true
   */
  styles?: true | 'none' | 'sass' | {
    configFile: string
  }

  /**
   * The module will add `vuetify/styles` in Nuxt `css` option.
   * Disable default Vuetify styles
   * @default false
   */
  disableVuetifyStyles?: boolean

  /**
   * Enable automatic tree-shaking via vite-plugin-vuetify
   * Vuetify components and directives will be automatically imported
   * include lab when autoImport:{labs:true}
   * Ignoring components or directives: autoImport:{ignore:[Component name and Directive name here]}
   * @default true
   */
  autoImport?: boolean | {
    labs?: boolean
    ignore?: (keyof typeof Components | keyof typeof Directives)[]
  }

  /**
   * Auto-import Vuetify composables
   * @default true
   */
  importComposables?: boolean

  /**
   * If you are using another composables that collide with the Vuetify ones,
   * enable this flag to prefix them with `V`:
   * - `useLocale` -> `useVLocale`
   * - `useDefaults` -> `useVDefaults`
   * - `useDisplay` -> `useVDisplay`
   * - `useLayout` -> `useVLayout`
   * - `useRtl` -> `useVRtl`
   * - `useTheme` -> `useVTheme`
   *
   * @default false
   */
  prefixComposables?: boolean

  /**
   * Transform asset URLs in Vuetify components
   * @default true
   */
  transformAssetUrls?: boolean

  /**
   * Prefetch Vuetify chunks for faster navigation
   * @default true
   */
  prefetch?: boolean

  /**
   * Preload critical Vuetify chunks
   * @default true
   */
  preload?: boolean

}

/**
 * Vuetify instance configuration
 */
export interface VuetifyOptions extends Partial<Omit<VOptions, 'aliases' | 'theme'>> {
  /**
   * Component aliases (e.g., { VButton: VBtn , MyButton: 'VBtn'})
   */
  aliases?: Record<string, keyof typeof import('vuetify/components')> | Record<string, string>

  /**
   * Theme configuration
   */
  theme?: Exclude<VOptions['theme'], false>

}

/**
 * Vuetify Runtime configuration
 */
export interface VuetifyRuntimeConfig {
  aliases?: Exclude<VuetifyOptions['aliases'], undefined>
  date?: Exclude<VuetifyOptions['date'], undefined>
  defaults?: Exclude<VuetifyOptions['defaults'], undefined>
  display?: Exclude<VuetifyOptions['display'], undefined>
  theme?: Exclude<VuetifyOptions['theme'], undefined>
  icons?: Omit<Exclude<VuetifyOptions['icons'], undefined>, 'aliases' | 'sets'>
  locale?: Exclude<VuetifyOptions['locale'], undefined>
  ssr?: Exclude<VuetifyOptions['ssr'], undefined>
}

/**
 * Module options
 */
export interface ModuleOptions extends VuetifyModuleOptions {
  vuetifyOptions: VuetifyOptions
}
export interface ModulePublicRuntimeConfig {
  vuetify: Partial<VuetifyRuntimeConfig>
}

// Hook Definition
export interface ModuleHooks {
  'vuetify:registerModule': (registerModule: (config: VuetifyOptions) => void) => HookResult
}

export interface ModuleRuntimeHooks {
  'vuetify:before-create': (ctx: { vuetifyOptions: VuetifyOptions }) => HookResult
  'vuetify:configuration': (ctx: { vuetifyOptions: VuetifyOptions }) => HookResult
  'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
}
// Used by module for type inference
declare module '#app' {
  interface NuxtApp {
    $vuetify: ReturnType<typeof createVuetify>
    $config: {
      public: {
        vuetify: Partial<VuetifyOptions>
      }
    }
  }
  interface RuntimeNuxtHooks extends ModuleRuntimeHooks {
    'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  }
}

// Augment Nuxt schema types
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ['vuetify']?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    ['vuetify']: Partial<ModuleOptions>
  }

  interface NuxtHooks extends ModuleHooks {
    'vuetify:registerModule': (registerModule: (config: Pick<ModuleOptions, 'vuetifyOptions'>) => void) => HookResult
  }
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {
    vuetify: {
      icons: {
        defaultSet: string
      }
    }
  }
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {
    vuetify: {
      icons: {
        defaultSet: string
      }
    }
  }
  interface NuxtHooks extends ModuleHooks {
    'vuetify:registerModule': (registerModule: (config: Pick<ModuleOptions, 'vuetifyOptions'>) => void) => HookResult
  }
}

// Augment #app types

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vuetify: ReturnType<typeof createVuetify>
  }
}

/**
 * Snackbar options for show() method
 */
export interface SnackbarOptions {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning' | string
  timeout?: number
  location?: Anchor
  icon?: string
}

/**
 * Snackbar state interface
 */
export interface SnackbarState {
  visible: boolean
  message: string
  color: string
  timeout: number
  location: Anchor
  icon?: string
}

/**
 * Confirm dialog options
 */
export interface ConfirmDialogOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  cancelColor?: string
  persistent?: boolean
}

/**
 * Confirm dialog state interface
 */
export interface ConfirmDialogState {
  visible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  confirmColor: string
  cancelColor: string
  persistent: boolean
}

/**
 * Loading state options
 */
export interface LoadingOptions {
  text?: string
  color?: string
}

export {}
