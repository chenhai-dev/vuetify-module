import type {
    ThemeDefinition,
    IconOptions,
    Blueprint,
} from 'vuetify'
import type {DefaultsOptions} from "vuetify/lib/composables/defaults";
import type {SSROptions} from "vuetify/lib/composables/display";
export type { ThemeDefinition,IconOptions}
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
    defaultTheme?: 'light' | 'dark' | 'system' | (string & {});

    /**
     * Custom theme definitions
     */
    themes?: Record<string, ThemeDefinition>;

    /**
     * Component Register - Custom from Vuetify
     * aliases: {
     *    VButton: 'VBtn'
     * }
     */
    aliases?:Record<string, unknown>

    /**
     * Default component props
     */
    defaults?: DefaultsOptions

    /**
     * Blueprint preset name
     */
    blueprint?: Blueprint

    /**
     * Icon configuration
     */
    icons?:IconOptions & {
        /**
         * Use SVG icons for better performance
         * @default false
         */
        useSvg?: boolean
    }

    /**
     * SSR configuration
     */
    ssr?: SSROptions

    /**
     * SASS/SCSS customization
     */
    styles?: {
        /**
         * Path to custom SASS variables file
         */
        configFile?: string

        /**
         * Disable default Vuetify styles
         * @default false
         */
        disableVuetifyStyles?: boolean
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
     * Enable lab components (experimental)
     * @default false
     */
    labComponents?: boolean
    /**
     * Enable transform asset url
     * @default false
     */
    transformAssetUrls?:boolean
    
}

// VuetifyOptions configuration
export interface VuetifyOptions {
    defaultTheme: Exclude<ModuleOptions['defaultTheme'], undefined>
    themes: Exclude<ModuleOptions['themes'], undefined>
    aliases: Exclude<ModuleOptions['aliases'], undefined>
    defaults: Exclude<ModuleOptions['defaults'], undefined>
    icons: Exclude<ModuleOptions['icons'], undefined>
    ssr: Exclude<ModuleOptions['ssr'], undefined>
    blueprint: Exclude<ModuleOptions['blueprint'], undefined>
    labComponents: Exclude<ModuleOptions['labComponents'], undefined>
}

// Resolved configuration
export interface VuetifyConfig {
    themes: ModuleOptions['themes']
    defaults: ModuleOptions['defaults']
    icons: ModuleOptions['icons']
    aliases: ModuleOptions['aliases']
}