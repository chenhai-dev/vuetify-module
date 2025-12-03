import {
    addComponentsDir,
    addImports,
    addPlugin,
    addTemplate,
    createResolver,
    defineNuxtModule, useLogger
} from '@nuxt/kit'
import {md1} from "vuetify/blueprints";
import {transformAssetUrls} from "vite-plugin-vuetify";
import {defu} from 'defu'
import type {HookResult} from "@nuxt/schema";
import type { ModuleOptions,VuetifyConfig, VuetifyOptions} from "./types";
import {generateVuetifyConfig} from "./utils/vuetifyConfig";
import {viteConfig} from "./utils/configure-vite";


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

        },
        blueprint:md1,
        // Icon
        icons: {
            defaultSet: 'mdi',
            aliases:{},
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
        transformAssetUrls: true,
    },

    // Setup function
    async setup(options, nuxt) {

        const resolver = createResolver(import.meta.url)

        // ============================================
        // CSS Configuration
        // ============================================
        // Add Vuetify CSS (unless disabled)
        if (!options.styles?.disableVuetifyStyles) {
            nuxt.options.css.push('vuetify/styles')
        }
        // Add icon font CSS if not using SVG
        if (!options.icons?.useSvg) {
            nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')
        }


        // ============================================
        // Vite Configuration for Vuetify
        // ============================================

        nuxt.options.vite=viteConfig(nuxt.options.vite,options)

        // ============================================
        // Vue Configuration
        // ============================================

        // Transform asset URLs for Vuetify components (v-img, v-card, etc.)
        if (options.transformAssetUrls !== false) {
            nuxt.options.vue = nuxt.options.vue || {}
            nuxt.options.vue = nuxt.options.vue || {}
            nuxt.options.vue.transformAssetUrls = transformAssetUrls
        }


        // ============================================
        // Features Configuration for Vuetify SSR
        // ============================================

        // IMPORTANT: If using SASS configFile with SSR, disable inlineStyles
        // @see https://vuetify-nuxt-module.netlify.app/guide/server-side-rendering.html
        if (options.styles?.configFile && nuxt.options.ssr) {
            nuxt.options.features = nuxt.options.features || {}
            nuxt.options.features.inlineStyles = false
        }


        // ============================================
        // Build Configuration
        // ============================================

        // Add Vuetify to transpile
        nuxt.options.build.transpile.push('vuetify')

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

        // ============================================
        // Runtime Configuration
        // ============================================
        // Expose options to public runtime config
        nuxt.options.runtimeConfig.public.vuetify = defu(
            nuxt.options.runtimeConfig.public.vuetify || {},
            options
        )
        // Expose options to private runtime config
        nuxt.options.runtimeConfig.vuetify = defu(
            nuxt.options.runtimeConfig.vuetify || {},
            options
        )

        const resolvedConfig: VuetifyConfig = {
            themes: options.themes,
            defaults: options.defaults,
            icons: options.icons,
            aliases: options.aliases,
        }

        // Build VuetifyOptions for config generation
        const vuetifyOptions: VuetifyOptions = {
            defaultTheme: options.defaultTheme || 'light',
            themes: resolvedConfig.themes || {},
            aliases: resolvedConfig.aliases || {},
            defaults: resolvedConfig.defaults || {},
            icons: resolvedConfig.icons || {defaultSet: 'mdi'},
            ssr: options.ssr || false,
            blueprint: options.blueprint || md1,
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

        // ============================================
        // Vuetify Plugin
        // ============================================
        addPlugin({
            src: resolver.resolve('./runtime/plugins/vuetify'),
            mode: 'all',
        })

        // ============================================
        // Auto-import Composables
        // ============================================
        addImports([
            {
                name: 'useVTheme',
                from: resolver.resolve('./runtime/composables/useVTheme'),
            },
            {
                name: 'useVDefaults',
                from: resolver.resolve('./runtime/composables/useVDefaults'),
            },
            {
                name: 'useAppTheme',
                from: resolver.resolve('./runtime/composables/useTheme'),
            },
            {
                name: 'useSnackbar',
                from: resolver.resolve('./runtime/composables/useSnackbar'),
            },
            {
                name: 'useConfirmDialog',
                from: resolver.resolve('./runtime/composables/useConfirmDialog'),
            },
            {
                name: 'useBreakpoints',
                from: resolver.resolve('./runtime/composables/useBreakpoints'),
            },
            {
                name: 'useLoading',
                from: resolver.resolve('./runtime/composables/useLoading'),
            },
        ])

        // ============================================
        // Hook: components:dirs - Component directory registration
        // ============================================
        // nuxt.hook('components:dirs', (dirs) => {
        //     dirs.push({
        //         path: resolver.resolve('./runtime/components'),
        //         prefix: 'Vuetify',
        //         pathPrefix: false,
        //     })
        //     logger.info('Registered Vuetify component directories')
        // })
        // Add custom components
        addComponentsDir({
            path: resolver.resolve('runtime/components'),
        })

        // Add type declarations (Nuxt 4 has improved TypeScript support)
        nuxt.hook('prepare:types', ({references}) => {
            references.push({
                types: 'vuetify',
            })
        })

        // ============================================
        // Hook: imports:extend - Auto-import configuration
        // ============================================
        nuxt.hook('imports:extend', (imports) => {
            imports.push({
                name: 'useDisplay',
                from: 'vuetify',
            })
            imports.push({
                name: 'useTheme',
                from: 'vuetify',
            })
            logger.info('Extended auto-imports for Vuetify')
        })

        // ============================================
        // Hook: vite:extendConfig - Vite optimization for Vuetify
        // ============================================
        nuxt.hook('vite:extendConfig', (config) => {
            // Ensure CSS code splitting is enabled
            if (config.build) {
                config.build.cssCodeSplit = true
            }

            // Add Vuetify to optimizeDeps for faster dev startup
            if (config.optimizeDeps) {
                config.optimizeDeps.include = config.optimizeDeps.include || []
                if (!config.optimizeDeps.include.includes('vuetify')) {
                    config.optimizeDeps.include.push('vuetify')
                }
            }

            logger.info('Extended Vite config for Vuetify optimization')
        })
        // ============================================
        // Hook: nitro:config - SSR configuration
        // ============================================
        nuxt.hook('nitro:config', (nitroConfig) => {
            // Note: Both Vite SSR noExternal and Nitro externals.inline
            // are needed for proper SSR bundling of Vuetify
            nitroConfig.externals = nitroConfig.externals || {}
            nitroConfig.externals.inline = nitroConfig.externals.inline || []
            if (Array.isArray(nitroConfig.externals.inline)) {
                nitroConfig.externals.inline.push('vuetify')
            }

            logger.info('Configured Nitro for Vuetify SSR')
        })

        // Log setup completion in dev mode
        if (nuxt.options.dev) {
            logger.success('✅ Vuetify Module (Nuxt 4) initialized')
        }
        // ============================================
        // Hook: build:before - Build lifecycle start
        // ============================================
        nuxt.hook('build:before', () => {
            logger.info('Starting build with Vuetify module...')
        })

        // ============================================
        // Hook: build:done - Build lifecycle complete
        // ============================================
        nuxt.hook('build:done', () => {
            logger.success('Build completed with Vuetify module')
        })

        // ============================================
        // Hook: modules:done - Module completion
        // ============================================
        nuxt.hook('modules:done', async () => {
            await nuxt.callHook('vuetify:config', {
                themes: options.themes,
                defaults: options.defaults,
                icons: options.icons,
                aliases: options.aliases,
            })
            logger.info('All modules loaded, Vuetify module initialized')
        })

        // ============================================
        // Hook: ready - App lifecycle ready
        // ============================================
        nuxt.hook('ready', () => {
            logger.success('Nuxt app ready with Vuetify module')
        })

        // ============================================
        // Hook: close - App lifecycle close
        // ============================================
        nuxt.hook('close', () => {
            logger.info('Closing Nuxt app with Vuetify module')
        })
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

    // interface NuxtOptions {
    //     vuetify?: ModuleOptions
    // }

    interface PublicRuntimeConfig {
        vuetify: VuetifyOptions
    }

    interface RuntimeConfig {
        vuetify: VuetifyOptions,
        public: PublicRuntimeConfig
    }
}

// declare module '#app' {
//     interface NuxtApp {
//         $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
//     }
// }