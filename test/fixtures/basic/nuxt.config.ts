import VuetifyModule from '../../../src/module'

export default defineNuxtConfig({

  modules: [VuetifyModule],
  compatibilityDate: '2025-12-05',
  vuetify: {
    treeShaking: true,
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
      },
    },
  },
})
