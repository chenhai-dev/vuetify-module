import type {
    ThemeDefinition,
    IconAliases,
    IconSet, Blueprint,
} from 'vuetify'
import type {DefaultsOptions} from "vuetify/lib/composables/defaults";
import type {SSROptions} from "vuetify/lib/composables/display";

type InternalIconOptions = {
    defaultSet: 'mdi' | 'fa' | 'mdi-svg' | string;
    aliases: Partial<IconAliases>;
    sets: Record<string, IconSet>;
}
export type IconOptions =  Partial<InternalIconOptions>
export type { ThemeDefinition }
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
     *    MyButton: 'VBtn'
     * }
     */
    aliases?:Record<string, unknown>

    /**
     * Default component props
     */
    defaults?: DefaultsOptions

    /**
     * Enable lab components (experimental)
     * @default false
     */
    labComponents?: boolean

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

    transformAssetUrls?:boolean
    
}

// VuetifyOptions configuration
export interface VuetifyOptions {
    defaultTheme: ModuleOptions['defaultTheme']
    themes: ModuleOptions['themes']
    defaults: ModuleOptions['defaults']
    icons: ModuleOptions['icons']
}