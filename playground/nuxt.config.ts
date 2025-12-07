export default defineNuxtConfig({
  modules: ['../src/module'],

  ssr: false,
  devtools: { enabled: true },

  // ─────────────────────────────────────────────────────────────
  // ADDITIONAL NUXT OPTIMIZATIONS FOR FAST LOADING
  // ─────────────────────────────────────────────────────────────

  // Enable experimental features for better performance
  experimental: {
    // Payload extraction for faster hydration
    payloadExtraction: true,
    // Render JSON payloads with support for reviving complex types
    renderJsonPayloads: true,
  },
  compatibilityDate: '2025-12-05',

  // Vite optimizations
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
    },

  },
  // Vuetify module configuration
  vuetify: {
    vuetifyOptions: {
      defaults: {
        global: {
          ripple: true,
        },
        VBtn: {
          color: 'primary',
          variant: 'elevated',
        },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
          hideDetails: 'auto',
        },
        VCard: {
          variant: 'elevated',
        },
      },

      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976D2',
              secondary: '#9C27B0',
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
              secondary: '#BB86FC',
              accent: '#FF4081',
              error: '#CF6679',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
              background: '#121212',
              surface: '#1E1E1E',
            },
          },
        },
      },
      display: {
        mobileBreakpoint: 'md',
        thresholds: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
          xxl: 2560,
        },
      },

      icons: {
        defaultSet: 'mdi',
      },

      // Locale configuration
      locale: {
        locale: 'en',
        fallback: 'en',
      },

      // SSR configuration
      ssr: true,
    },
    styles: {
      configFile: 'assets/scss/vuetify-settings.scss',
    },
    autoImport: true,
    importComposables: true,
    prefetch: true,
    preload: true,

  },
})
