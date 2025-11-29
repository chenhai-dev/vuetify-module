// Nuxt 4 configuration
export default defineNuxtConfig({
    // Nuxt 4 compatibility
    compatibilityDate: '2025-01-01',

    modules: ['../src/module'],

    devtools: { enabled: true },

    // Configure the custom Vuetify module
    Vuetify: {
        enabled: true,
        defaultTheme: 'light',

        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#6200EE',
                    'primary-darken-1': '#3700B3',
                    secondary: '#03DAC6',
                    'secondary-darken-1': '#018786',
                    accent: '#82B1FF',
                    error: '#CF6679',
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
                    primary: '#BB86FC',
                    'primary-darken-1': '#3700B3',
                    secondary: '#03DAC6',
                    'secondary-darken-1': '#03DAC6',
                    accent: '#FF4081',
                    error: '#CF6679',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    background: '#121212',
                    surface: '#1E1E1E',
                },
            },
            // Custom brand theme
            brand: {
                dark: false,
                colors: {
                    primary: '#FF6B35',
                    secondary: '#004E89',
                    accent: '#F7C59F',
                    error: '#E63946',
                    info: '#457B9D',
                    success: '#2A9D8F',
                    warning: '#E9C46A',
                    background: '#FFF8F0',
                    surface: '#FFFFFF',
                },
            },
        },

        defaults: {
            VBtn: {
                rounded: 'lg',
                elevation: 2,
            },
            VCard: {
                rounded: 'xl',
                elevation: 4,
            },
            VTextField: {
                variant: 'outlined',
                density: 'comfortable',
                color: 'primary',
            },
            VSelect: {
                variant: 'outlined',
                density: 'comfortable',
            },
            VAppBar: {
                elevation: 0,
            },
        },

        icons: {
            defaultSet: 'mdi',
            useSvg: false,
        },

        performance: {
            treeShaking: true,
        },
    },

    // Nuxt 4 experimental features
    experimental: {
        payloadExtraction: true,
    },
})
