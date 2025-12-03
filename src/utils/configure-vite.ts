import type {ViteOptions} from "@nuxt/schema";
import type {OutputOptions} from "rollup";
import vuetify from 'vite-plugin-vuetify';
import type {ModuleOptions} from "../types";
export const viteConfig = (config:ViteOptions,options:ModuleOptions) => {
    // Configure Vite for Vuetify (Nuxt 4 uses Vite by default)
    config = config || {}

    // Define process.env.DEBUG for Vuetify
    config.define = config.define || {}
    config.define['process.env.DEBUG'] = false

    // SASS configuration with modern compiler (Nuxt 4 default)
    if (options.styles){
        config.css = config.css || {}
        config.css.preprocessorOptions = config.css.preprocessorOptions || {}
        // Add custom SASS config file if provided
        if (options.styles.configFile) {
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
    }

    // SSR configuration - Vuetify must not be externalized
    // @see https://vuetifyjs.com/en/getting-started/installation/#ssr
    if (options.performance?.treeShaking !== false) {
        config = config || {}
        config.ssr = config.ssr || {}
        config.ssr.noExternal = config.ssr.noExternal || []

        if (Array.isArray(config.ssr.noExternal)) {
            config.ssr.noExternal.push('vuetify')
        }
    }


    // Optimize dependencies for faster dev startup
    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.include = config.optimizeDeps.include || []
    config.optimizeDeps.include.push('vuetify')

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

    // addVitePlugin(vuetify({
    //     autoImport: options.performance?.treeShaking !== false,
    //     styles: options.styles?.configFile
    //         ? { configFile: options.styles.configFile }
    //         : true,
    // }))
    return config
}