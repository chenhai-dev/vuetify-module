import {
    addComponent,
    addImports,
    addPlugin,
    addTemplate,
    createResolver,
    defineNuxtModule, extendViteConfig,
} from '@nuxt/kit'
import type {HookResult} from "@nuxt/schema";
import {defu} from 'defu'
import type {ModuleOptions, ResolvedConfig,ThemeDefinition} from "./runtime/types";
import {generateVuetifyConfig} from "./runtime/utils";
import type {OutputOptions} from "rollup";

// Declare module augmentation for Nuxt 4
declare module '@nuxt/schema' {
    interface NuxtHooks {
        'nuxt-vuetify:config': (config: ResolvedConfig) => HookResult
    }
    interface NuxtConfig {
        Vuetify?: ModuleOptions
    }

    interface NuxtOptions {
        Vuetify?: ModuleOptions
    }

    interface PublicRuntimeConfig {
        Vuetify: {
            defaultTheme: string
            themes: Record<string, Partial<ThemeDefinition>>
            defaults: Record<string, Record<string, unknown>>
            icons: ModuleOptions['icons']
            ssr: ModuleOptions['ssr']
            blueprint?: 'md1' | 'md2' | 'md3'
            labComponents?: boolean
        }
    }
}

declare module '#app' {
    interface NuxtApp {
        $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
    }

    interface RuntimeNuxtHooks {
        'nuxt-vuetify:config': (config: ResolvedConfig) => HookResult
    }
}

export interface ModuleHooks {
    'nuxt-vuetify:config': (config: ResolvedConfig) => HookResult
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'nuxt-vuetify-module',
        configKey: 'Vuetify',
        compatibility: {
            // Nuxt 4.2.1+ compatibility
            nuxt: '>=4.2.1',
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
        styles: {
            disableVuetifyStyles: false,
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
        if (!options.enabled) return

        const resolver = createResolver(import.meta.url)


        // Resolve configuration
        const resolvedConfig: ResolvedConfig = {
            defaultTheme: options.defaultTheme || 'light',
            themes: options.themes || {},
            defaults: options.defaults || {},
            icons: options.icons || {},
            // ssr: options.ssr || {},
            // blueprint: options.blueprint || 'md3',
            // labComponents: options.labComponents || false,
        }

        // Call custom hook for config modification
        // In Nuxt 4, hooks are called during modules:done
        nuxt.hook('modules:done', async () => {
            await nuxt.callHook('nuxt-vuetify:config', resolvedConfig)
        })

        // Expose options to runtime config
        nuxt.options.runtimeConfig.public.Vuetify = defu(
            nuxt.options.runtimeConfig.public.Vuetify || {},
            {
                defaultTheme: resolvedConfig.defaultTheme,
                themes: resolvedConfig.themes,
                defaults: resolvedConfig.defaults,
                icons: resolvedConfig.icons || {},
                ssr: options.ssr || {},
                blueprint: options.blueprint || 'md3',
                labComponents: options.labComponents || false
            }
        )

        // Add Vuetify to transpile
        nuxt.options.build.transpile.push('vuetify')

        // Configure Vite for Vuetify (Nuxt 4 uses Vite by default)

        extendViteConfig((config) => {
            config.optimizeDeps ||= {}
            config.optimizeDeps.include ||= []
            config.optimizeDeps.include.push('vuetify')

            // SASS configuration with modern compiler (Nuxt 4 default)
            config.css = config.css || {}
            config.css.preprocessorOptions = config.css.preprocessorOptions || {}
            config.css.preprocessorOptions.scss = {
                ...config.css.preprocessorOptions.scss,
            }

            // Define process.env.DEBUG for Vuetify
            config.define = config.define || {}
            config.define['process.env.DEBUG'] = false

            // Chunk splitting for better caching
            config.build = config.build || {}
            config.build.rollupOptions = config.build.rollupOptions || {}
            config.build.rollupOptions.output = config.build.rollupOptions.output || {}

            if (!Array.isArray(config.build.rollupOptions.output)) {
                config.build.rollupOptions.output.manualChunks = {
                    ...((config.build.rollupOptions.output as OutputOptions).manualChunks || {}),
                    vuetify: ['vuetify'],
                }
            }
        })

        // Add Vuetify CSS (unless disabled)
        if (!options.styles?.disableVuetifyStyles) {
            nuxt.options.css.push('vuetify/styles')
        }

        // Add custom SASS config file if provided
        if (options.styles?.configFile) {
            extendViteConfig((config) => {
                // Configure vite-plugin-vuetify for SASS variable customization
                config.css = config.css || {}
                config.css.preprocessorOptions = config.css.preprocessorOptions || {}
                config.css.preprocessorOptions.scss = {
                    ...config.css.preprocessorOptions.scss,
                    additionalData: `@use "${options.styles!.configFile}" as *;`,
                }
            })
        }

        // Add icon font CSS if not using SVG
        if (!options.icons?.useSvg) {
            nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')
        }

        // Generate Vuetify configuration template
        addTemplate({
            filename: 'vuetify-config.mjs',
            getContents: () => generateVuetifyConfig(
                options,
                resolvedConfig.themes as Record<string, Partial<ThemeDefinition>>,
                resolvedConfig
            ),
        })

        // Add the Vuetify plugin
        addPlugin({
            src: resolver.resolve('./runtime/plugins/vuetify'),
            mode: 'all',
        })

        // Add composables with explicit imports (Nuxt 4 style)
        addImports([
            {
                name: 'useVTheme',
                from: resolver.resolve('./runtime/composables/useVTheme'),
            },
            {
                name: 'useVDefaults',
                from: resolver.resolve('./runtime/composables/useVDefaults'),
            },
        ])

        // Add custom components
        addComponent({
            name: 'VThemeProvider',
            filePath: resolver.resolve('./runtime/components/VThemeProvider.vue'),
        })

        // Add type declarations (Nuxt 4 has improved TypeScript support)
        nuxt.hook('prepare:types', ({references}) => {
            references.push({
                types: 'vuetify',
            })
        })

        // Log setup completion in dev mode
        if (nuxt.options.dev) {
            console.log('✅ Vuetify Module (Nuxt 4) initialized')
        }
    },
})


