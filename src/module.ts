import {
    addComponent,
    addImports,
    addPlugin,
    addTemplate,
    createResolver,
    defineNuxtModule, extendViteConfig, useLogger,
} from '@nuxt/kit'
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
import {md3} from "vuetify/blueprints";
import {defu} from 'defu'
import type {HookResult} from "@nuxt/schema";
import type {OutputOptions} from "rollup";
import type {ModuleOptions, VuetifyConfig, ThemeDefinition, VuetifyOptions} from "./runtime/types";
import {generateVuetifyConfig} from "./runtime/utils";

// Re-export types
export type {ModuleOptions, VuetifyConfig, VuetifyOptions, ThemeDefinition}

export interface ModuleHooks {
    'vuetify:config': (config: VuetifyConfig) => HookResult
}

const logger = useLogger(`nuxt:vuetify`)
export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vuetify-module',
        configKey: 'vuetify',
        compatibility: {
            nuxt: '^3.9.0 || ^4.0.0',
        },
    },

    // Default configuration options of the Nuxt module
    defaults: {
        enabled: true,
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    // Color
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    //Background
                    background: '#FAFAFA',
                    surface: '#FFFFFF',
                },
            },
            dark: {
                dark: true,
                colors: {
                    // Color
                    primary: '#2196F3',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    //Background
                    background: '#121212',
                    surface: '#212121',
                },
            },
        },
        aliases: {},
        // Default Component - Props
        defaults: {
            VBtn: {
                color: "primary",
                density: "compact",
                slim: true,
                variant: "outlined",
            },
            VCard: {
                density: "compact",
                variant: "outlined",
            },
            VTextField: {
                density: "compact",
                hideDetails: 'auto',
                variant: "outlined",

            },
            VTextarea: {
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VSelect: {
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VAutocomplete: {
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VCombobox: {
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VCheckbox: {
                color: "primary",
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VRadio: {
                color: "primary",
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VSwitch: {
                color: "primary",
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VFileInput: {
                density: "compact",
                variant: "outlined",
                hideDetails: 'auto',
            },
            VList: {
                slim: true,
            },
            VListItem: {
                slim: true,
            },
            VTab: {
                sliderColor: "primary",
                slim: true,
            },
        },
        // Icon
        icons: {
            defaultSet: 'mdi',
            useSvg: false,
        },
        //SSR
        ssr: {
            clientWidth: 1920,
            clientHeight: 1080,
        },
        // Style
        styles: {
            disableVuetifyStyles: false,
        },
        performance: {
            treeShaking: true,
            prefetch: false,
        },
        // Lab components
        labComponents: false,
        transformAssetUrls: true,
    },

    // Setup function
    async setup(options, nuxt) {
        // Skip if disabled
        if (!options.enabled) {
            logger.warn('Module is disabled');
            return
        }

        const resolver = createResolver(import.meta.url)

        const resolvedConfig: VuetifyConfig = {
            themes: options.themes,
            defaults: options.defaults,
            icons: options.icons,
            aliases: options.aliases,
        }

        // Call custom hook for config modification
        // In Nuxt 4, hooks are called during modules:done
        nuxt.hook('modules:done', async () => {
            await nuxt.callHook('vuetify:config', resolvedConfig)
        })

        // Expose options to runtime config (only serializable options)
        nuxt.options.runtimeConfig.public.vuetify = defu(
            nuxt.options.runtimeConfig.public.vuetify || {},
            {
                defaultTheme: options.defaultTheme,
                themes: resolvedConfig.themes,
                defaults: resolvedConfig.defaults,
                icons: resolvedConfig.icons,
                aliases: resolvedConfig.aliases,
                ssr: options.ssr,
                blueprint: options.blueprint,
                labComponents: options.labComponents,
            }
        )
        nuxt.options.runtimeConfig.vuetify = defu(
            nuxt.options.runtimeConfig.vuetify || {},
            {
                defaultTheme: options.defaultTheme,
                themes: resolvedConfig.themes,
                defaults: resolvedConfig.defaults,
                icons: resolvedConfig.icons,
                aliases: resolvedConfig.aliases,
                ssr: options.ssr,
                blueprint: options.blueprint,
                labComponents: options.labComponents,
            }
        )

        // Add Vuetify to transpile
        nuxt.options.build.transpile.push('vuetify')

        // IMPORTANT: If using SASS configFile with SSR, disable inlineStyles
        // @see https://vuetify-nuxt-module.netlify.app/guide/server-side-rendering.html
        if (options.styles?.configFile && nuxt.options.ssr) {
            // For Nuxt 3.9.0+
            nuxt.options.features = nuxt.options.features || {}
            nuxt.options.features.inlineStyles = false
        }

        // Configure Vite for Vuetify (Nuxt 4 uses Vite by default)
        extendViteConfig((config) => {
        // nuxt.hook('vite:extendConfig', (config) => {
            config.optimizeDeps = nuxt.options.vite.optimizeDeps || {};
            config.optimizeDeps.include = nuxt.options.vite.optimizeDeps?.include || [];
            config.optimizeDeps.include.push('vuetify')

            // SASS configuration with modern compiler (Nuxt 4 default)
            config.css = config.css || {}
            config.css.preprocessorOptions = config.css.preprocessorOptions || {}
            // Add custom SASS config file if provided
            if (options.styles?.configFile) {
                // Configure vite-plugin-vuetify for SASS variable customization
                config.css.preprocessorOptions.scss = {
                    ...config.css.preprocessorOptions.scss,
                    additionalData: `@use "${options.styles!.configFile}" as *;`,
                }
            }
            else {
                config.css.preprocessorOptions.scss = {
                    ...config.css.preprocessorOptions.scss,
                }
            }

            // Define process.env.DEBUG for Vuetify
            config.define = config.define || {}
            config.define['process.env.DEBUG'] = false

            // Add vite-plugin-vuetify for tree shaking and styles
            config.plugins = config.plugins || []
            config.plugins.push(
                vuetify({
                    autoImport: options.performance?.treeShaking !== false,
                    styles: options.styles?.configFile
                        ? { configFile: options.styles.configFile }
                        : true,
                })
            )

            // SSR configuration - Vuetify must not be externalized
            // @see https://vuetifyjs.com/en/getting-started/installation/#ssr
            if (options.performance?.treeShaking !== false) {
                config.ssr = config.ssr || {}
                config.ssr.noExternal = config.ssr.noExternal || []
                if (Array.isArray(config.ssr.noExternal)) {
                    config.ssr.noExternal.push('vuetify')
                }
            }


            // Chunk splitting for better caching (when treeShaking is enabled)
            if (options.performance?.treeShaking !== false) {
                config.build = config.build || {}
                config.build.rollupOptions = config.build.rollupOptions || {}
                config.build.rollupOptions.output = config.build.rollupOptions.output || {}

                if (!Array.isArray(config.build.rollupOptions.output)) {
                    config.build.rollupOptions.output.manualChunks = {
                        ...((config.build.rollupOptions.output as OutputOptions).manualChunks || {}),
                        vuetify: ['vuetify'],
                    }
                }
            }

        })

        // Transform asset URLs for Vuetify components (v-img, v-card, etc.)
        if (options.transformAssetUrls !== false) {
            nuxt.options.vue = nuxt.options.vue || {}
            nuxt.options.vue = nuxt.options.vue || {}
            nuxt.options.vue.transformAssetUrls = transformAssetUrls
        }

        // Add Vuetify CSS (unless disabled)
        if (!options.styles?.disableVuetifyStyles) {
            nuxt.options.css.push('vuetify/styles')
        }

        // Add icon font CSS if not using SVG
        if (!options.icons?.useSvg) {
            nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')
        }

        // Prefetch Vuetify chunks for faster navigation
        if (options.performance?.prefetch) {
            nuxt.hook('build:manifest', (manifest) => {
                for (const key in manifest) {
                    const entry = manifest[key]
                    if (entry?.file?.includes('vuetify')) {
                        entry.prefetch = true
                    }
                }
            })
        }

        // Build VuetifyOptions for config generation
        const vuetifyOptions: VuetifyOptions = {
            defaultTheme: options.defaultTheme || 'light',
            themes: resolvedConfig.themes || {},
            aliases: resolvedConfig.aliases || {},
            defaults: resolvedConfig.defaults || {},
            icons: resolvedConfig.icons || {defaultSet: 'mdi'},
            ssr: options.ssr || false,
            blueprint: options.blueprint || md3,
            labComponents: options.labComponents || false,
        }

        // Generate Vuetify configuration template
        addTemplate({
            filename: 'vuetify-config.mjs',
            getContents: () => generateVuetifyConfig(
                options,
                resolvedConfig.themes,
                vuetifyOptions
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

// Declare module augmentation for Nuxt 4
declare module 'nuxt/schema' {
    interface NuxtConfig {
        vuetify?: ModuleOptions
    }

    interface NuxtHooks {
        'vuetify:config': (config: VuetifyConfig) => HookResult
    }
}

declare module '@nuxt/schema' {
    interface NuxtApp {
        $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
    }

    interface NuxtHooks {
        'vuetify:config': (config: VuetifyConfig) => HookResult
    }

    interface NuxtConfig {
        vuetify?: ModuleOptions
    }

    interface NuxtOptions {
        vuetify?: ModuleOptions
    }

    interface PublicRuntimeConfig {
        vuetify: VuetifyOptions
    }

    interface RuntimeConfig {
        vuetify: VuetifyOptions,
        public: PublicRuntimeConfig
    }
}

declare module '#app' {
    interface NuxtApp {
        $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
    }
}


