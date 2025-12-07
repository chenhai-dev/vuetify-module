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
      // Chunk size warnings threshold
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            'vuetify': ['vuetify'],
            'vuetify-labs': ['vuetify/labs/components'],
          },
        },
      },
    },
  },
  debug: true,
  // Vuetify module configuration
  vuetify: {
    // ─────────────────────────────────────────────────────────────
    // PERFORMANCE OPTIONS (for fast page load)
    // ─────────────────────────────────────────────────────────────

    // Enable tree-shaking to reduce bundle size (recommended)
    autoImport: true,

    // Prefetch Vuetify chunks for faster navigation
    prefetch: true,

    // Preload critical Vuetify assets
    preload: true,

    // Use SASS source for custom variables (optional, slower build but smaller CSS)
    // styles: 'sass',

    // ─────────────────────────────────────────────────────────────
    // FEATURE OPTIONS
    // ─────────────────────────────────────────────────────────────

    // Auto-import Vuetify composables (useTheme, useDisplay, etc.)
    importComposables: true,

    // ─────────────────────────────────────────────────────────────
    // VUETIFY OPTIONS (customize your Vuetify instance)
    // ─────────────────────────────────────────────────────────────
    vuetifyOptions: {
      // Component defaults - customize your component props
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

      // Theme configuration
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

      // Display/breakpoint configuration
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

      // Icon configuration (mdi is default)
      icons: {
        defaultSet: 'mdi',
      },

      // Locale configuration
      locale: {
        locale: 'en',
        fallback: 'en',
      },

      // SSR configuration
      ssr: {
        clientWidth: 1280,
        clientHeight: 800,
      },
    },
  },
})
