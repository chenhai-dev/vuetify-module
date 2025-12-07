import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createVuetify, type VuetifyOptions as VOptions } from 'vuetify'
import { VuetifyDateAdapter } from 'vuetify/date/adapters/vuetify'
import type { VuetifyOptions } from '../types'
import { setIcon } from '../utils/icon'
import { setBlueprints } from '../utils/blueprints'
import { setLocaleOptions } from '~/src/utils/locale'

export default defineNuxtPlugin({
  name: 'vuetify:nuxt:plugin',
  parallel: true,
  enforce: 'pre', // Load before other plugins
  async setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig()
    const options: VuetifyOptions = runtimeConfig.public.vuetify as Partial<VuetifyOptions>

    const icons = setIcon(options)

    const blueprint = setBlueprints(options)
    const locale = setLocaleOptions(options)

    const resolvedOption: VuetifyOptions | VOptions = {
      ...options,
      date: options.date || {
        adapter: VuetifyDateAdapter,
        formats: {
          weekdayNarrow: { weekday: 'narrow' },
        },
      },
      icons: icons,
      locale: locale,
    }

    const vuetifyOptions: VuetifyOptions = {
      ...resolvedOption,
    }
    const option: VOptions = {
      ...resolvedOption,

      blueprint: blueprint,
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
    const vuetify = createVuetify(option)

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
