import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createVuetify, type VuetifyOptions as VOptions } from 'vuetify'
import type { VuetifyOptions, VuetifyRuntimeConfig } from '../types'
import { setIcon, loadBlueprint, setLocaleOptions, getDateAdapter, getBlueprintDefaults } from '../utils'
import { defu } from 'defu'

export default defineNuxtPlugin({
  name: 'vuetify:nuxt:plugin',
  parallel: true,
  enforce: 'pre', // Load before other plugins
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig()
    const options: VuetifyRuntimeConfig = runtimeConfig.public.vuetify as Partial<VuetifyRuntimeConfig>

    const icons = setIcon(options)

    const blueprint = await loadBlueprint(options.blueprint || 'md3') ?? getBlueprintDefaults('md3')
    const locale = setLocaleOptions(options)
    const adapter = await getDateAdapter(options.dateAdapter ?? 'vuetify')
    const date = {
      ...options.date,
      ...adapter,
    }

    // Resolved Option
    const resolvedOption: VuetifyOptions | VOptions = {
      ...options,
      icons: icons,
      locale: locale,
    }

    // Vuetify Option Configuration
    const vuetifyOptions: VuetifyOptions = {
      ...resolvedOption,
      date: date,
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
    const vuetify = createVuetify({
      ...resolvedOption,
      blueprint: blueprint,
    })

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
