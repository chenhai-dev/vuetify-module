import {computed, type ComputedRef, onMounted, type Ref} from 'vue'
import {type ThemeDefinition, type ThemeInstance, useTheme} from 'vuetify'

export interface UseVThemeOptions {
    /**
     * Persist theme choice in cookie
     * @default true
     */
    persist?: boolean

    /**
     * Cookie name for persistence
     * @default 'vuetify-theme'
     */
    cookieName?: string
}

interface UseVTheme {
    themes: Ref<Record<string, ThemeDefinition>, Record<string, ThemeDefinition>>,
    name: Readonly<Ref<string, string>>,
    current: Ref<ThemeDefinition>,

    computedThemes:Ref<Record<string, ThemeDefinition>>,
    global:{ name: Ref<string>, current: Ref<ThemeDefinition> },

    // ===== Helper properties =====
    isDark:ComputedRef<boolean>,
    availableThemes:ComputedRef<string[]>,
    colors:ComputedRef<Record<string, string>>

    // ===== Actions =====
    toggle:() => void,
    setTheme:(name: string) => void ,
    getColor:(name: string) => string | undefined,
    getCssVar:(name: string) => string,

    theme:ThemeInstance,
}

export function useVTheme(options: UseVThemeOptions = {}):UseVTheme {
    const { persist = true, cookieName = 'vuetify-theme' } = options

    const config = useRuntimeConfig().public.vuetify
    const theme = useTheme()

    // Cookie for persistence
    const themeCookie = useCookie<string>(cookieName, {
        default: () => config.defaultTheme || 'light'
    })

    // ===== Exposed from Vuetify useTheme =====

    /**
     * Raw theme objects - can be mutated to add new themes or update existing colors
     * @see https://vuetifyjs.com/en/api/use-theme/#exposed
     */
    const themes = theme.themes

    /**
     * Name of the current theme (inherited from parent components)
     * Use theme.global.name for the global theme
     */
    const name = theme.name

    /**
     * Processed theme object, includes automatically generated colors
     */
    const current = theme.current

    /**
     * All processed theme objects
     */
    const computedThemes = theme.computedThemes

    /**
     * Global theme state
     * - global.name: Ref<string> - Name of the current global theme (writable)
     * - global.current: Ref<ThemeDefinition> - Processed theme object of the current global theme
     */
    const global = theme.global

    // ===== Helper computed properties =====

    /**
     * Is the current theme dark
     */
    const isDark = computed(() => theme.global.current.value.dark)

    /**
     * List of available theme names
     */
    const availableThemes = computed(() => Object.keys(theme.themes.value))

    /**
     * Current theme colors
     */
    const colors = computed(() => theme.global.current.value.colors)

    // ===== Actions =====

    /**
     * Toggle between light and dark themes
     */
    const toggle = () => {
        const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
        theme.change(newTheme)
        if (persist) {
            themeCookie.value = newTheme
        }
    }

    /**
     * Set a specific theme by name
     */
    const setTheme = (themeName: string) => {
        if (Object.keys(theme.themes.value).includes(themeName)) {
            theme.change(themeName)
            if (persist) {
                themeCookie.value = themeName
            }
        } else {
            console.warn(`Theme "${themeName}" not found. Available themes: ${Object.keys(theme.themes.value).join(', ')}`)
        }
    }

    /**
     * Get a color value from the current theme
     */
    const getColor = (colorName: string): string | undefined => {
        return theme.global.current.value.colors[colorName]
    }

    /**
     * Get CSS variable string for a color (Vuetify 3 style)
     */
    const getCssVar = (colorName: string): string => {
        return `rgb(var(--v-theme-${colorName}))`
    }

    // Initialize theme from cookie on client
    onMounted(() => {
        if (persist && themeCookie.value && themeCookie.value !== theme.global.name.value) {
            theme.change(themeCookie.value)
        }
    })

    return {
        // ===== Vuetify useTheme exposed =====
        // @see https://vuetifyjs.com/en/api/use-theme/#exposed
        themes,           // Ref<Record<string, ThemeDefinition>> - Raw theme objects (mutable)
        name,             // Ref<string> - Current theme name (readonly, inherited)
        current,          // Ref<ThemeDefinition> - Processed current theme
        computedThemes,   // Ref<Record<string, ThemeDefinition>> - All processed themes
        global,           // { name: Ref<string>, current: Ref<ThemeDefinition> } - Global theme state

        // ===== Helper properties =====
        isDark,           // ComputedRef<boolean> - Is current theme dark
        availableThemes,  // ComputedRef<string[]> - List of theme names
        colors,           // ComputedRef<Record<string, string>> - Current theme colors

        // ===== Actions =====
        toggle,           // () => void - Toggle light/dark
        setTheme,         // (name: string) => void - Set specific theme
        getColor,         // (name: string) => string | undefined - Get color value
        getCssVar,        // (name: string) => string - Get CSS variable string

        // ===== Raw Vuetify theme instance =====
        theme,            // Full Vuetify theme instance for advanced usage
    }
}