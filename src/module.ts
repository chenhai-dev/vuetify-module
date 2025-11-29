import {
    addComponent,
    addImports,
    addPlugin,
    addTemplate,
    createResolver,
    defineNuxtModule, extendViteConfig, useLogger,
} from '@nuxt/kit'
import type {HookResult} from "@nuxt/schema";
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
import {defu} from 'defu'
import type {ModuleOptions, ThemeDefinition, VuetifyOptions} from "./runtime/types";
import {generateVuetifyConfig} from "./runtime/utils";
import type {OutputOptions} from "rollup";

export interface ModuleHooks {
    'vuetify:config': (config: VuetifyOptions) => HookResult
}

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)
export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vuetify-nuxt-module',
        configKey: CONFIG_KEY,
        compatibility: {
            nuxt: '^3.9.0 || ^4.0.0',
        },
    },

    // Default configuration options of the Nuxt module
    defaults: {
        enabled: true,
        // Vuetify theme :{defaultTheme:'light',themes:{light:{},dark:{}}}
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
        // Lab components
        labComponents: false,
        // Icon
        icons: {
            defaultSet: 'mdi',
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
    },

    // Setup function
    async setup(options, nuxt) {
        // Skip if disabled
        if (!options.enabled) {
            logger.warn('Module is disabled');
            return
        }

        const resolver = createResolver(import.meta.url)


        // Load configuration
        const config: VuetifyOptions = {
            defaultTheme: options.defaultTheme || 'light',
            themes: options.themes || {},
            defaults: options.defaults || {},
            icons: options.icons || {},
        }

        // Call custom hook for config modification
        // In Nuxt 4, hooks are called during modules:done
        nuxt.hook('modules:done', async () => {
            await nuxt.callHook('vuetify:config', config)
        })

        // Expose options to runtime config
        nuxt.options.runtimeConfig.public.Vuetify = defu(
            nuxt.options.runtimeConfig.public.Vuetify || {},
            {
                defaultTheme: config.defaultTheme,
                themes: config.themes,
                defaults: config.defaults,
                icons: config.icons || {},
                ssr: options.ssr || {},
                blueprint: options.blueprint || 'md3',
                labComponents: options.labComponents || false
            }
        )

        // 1. Configure Vite plugin
        if (options.performance?.treeShaking) {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                config.plugins?.push(vuetify({autoImport: true}));
            });
        }

        // Add Vuetify to transpile
        nuxt.options.build.transpile.push('vuetify')

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

        if (options.transformAssetUrls) {
            nuxt.options.vite.vue = nuxt.options.vite.vue || {};
            nuxt.options.vite.vue.template = nuxt.options.vite.vue.template || {};
            nuxt.options.vite.vue.template.transformAssetUrls = transformAssetUrls;
        }

        // Configure Vite for Vuetify (Nuxt 4 uses Vite by default)
        extendViteConfig((config) => {
            config.optimizeDeps = nuxt.options.vite.optimizeDeps || {};
            config.optimizeDeps.include = nuxt.options.vite.optimizeDeps?.include || [];
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

        // Generate Vuetify configuration template
        addTemplate({
            filename: 'vuetify-config.mjs',
            getContents: () => generateVuetifyConfig(
                options,
                config.themes as Record<string, Partial<ThemeDefinition>>,
                config
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
declare module '@nuxt/schema' {
    interface NuxtApp {
        $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
    }

    interface NuxtHooks {
        'vuetify:config': (config: VuetifyOptions) => HookResult
    }

    interface NuxtConfig {
        Vuetify?: ModuleOptions
    }

    interface NuxtOptions {
        Vuetify?: ModuleOptions
    }


    interface PublicRuntimeConfig {
        Vuetify: {
            defaultTheme: ModuleOptions['defaultTheme']
            themes: ModuleOptions['themes']
            defaults: ModuleOptions['defaults']
            icons: ModuleOptions['icons']
            ssr: ModuleOptions['ssr']
            blueprint?: ModuleOptions['blueprint']
            labComponents?: ModuleOptions['labComponents']
        }
    }
}


