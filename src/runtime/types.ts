import type { ThemeDefinition as VuetifyThemeDefinition } from 'vuetify'

export type ThemeDefinition = VuetifyThemeDefinition

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

        /**
         * Disable default Vuetify styles
         * @default false
         */
        disableVuetifyStyles?: boolean
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

// Resolved configuration
export interface ResolvedConfig {
    defaultTheme: string
    themes: ModuleOptions['themes']
    defaults: ModuleOptions['defaults']
    icons: {
        defaultSet?: 'mdi' | 'fa' | 'mdi-svg' | string
        aliases?: Record<string, string>
        useSvg?: boolean
    }
    // ssr: {
    //     clientWidth?: number
    //     clientHeight?: number
    // }
    // blueprint: 'md1' | 'md2' | 'md3'
    // labComponents: boolean
}

// Export types
export type { VuetifyThemeDefinition }