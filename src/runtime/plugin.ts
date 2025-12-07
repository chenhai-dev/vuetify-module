import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import type { VuetifyOptions } from '../types'

export default defineNuxtPlugin({
  name: 'vuetify:nuxt:plugin',
  parallel: true,
  enforce: 'pre', // Load before other plugins
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig()
    const options: VuetifyOptions = runtimeConfig.public.vuetify as Partial<VuetifyOptions>

    console.log('test', options)

    /*
    * Reconstruct full Vuetify config
    * (Runtime config can't serialize functions/classes, so we rebuild them here)
    */
    const vuetifyOptions: VuetifyOptions = {
      ...options,

      // Re-attach non-serializable blueprint:
      blueprint: md3,

      // Re-attach icon sets (non-serializable functions)
      icons: {
        defaultSet: options.icons?.defaultSet || 'mdi',
        aliases: {
          ...aliases,
          ...(options.icons?.aliases || {}),
        },
        sets: { mdi },
      },
    }

    /* -----------------------------------------------
     * Hook: After configuration, before Vue integration
     * --------------------------------------------- */
    await nuxtApp.callHook('vuetify:configuration', { vuetifyOptions })

    /* -----------------------------------------------
     * Emit before-create hook
     * Hook: Before Vuetify instance creation
     * Allows plugins/modules to modify options before creation
     * --------------------------------------------- */
    await nuxtApp.callHook('vuetify:before-create', { vuetifyOptions })

    /* -----------------------------------------------
     * Create Vuetify instance with Nuxt 4 SSR support
     * --------------------------------------------- */
    const vuetify = createVuetify(vuetifyOptions)

    /* -----------------------------------------------
     * Provide Vuetify to the Vue app
     * --------------------------------------------- */
    nuxtApp.vueApp.use(vuetify)

    /* -----------------------------------------------
     * Expose Vuetify instance via provide/inject ($vuetify)
     * --------------------------------------------- */
    nuxtApp.provide('vuetify', vuetify)

    /* -----------------------------------------------
     * Hook: Vuetify is ready and installed
     * --------------------------------------------- */
    await nuxtApp.callHook('vuetify:ready', vuetify)
  },
})
