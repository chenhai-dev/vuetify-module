import { computed, ref, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useRuntimeConfig, useCookie, useNuxtApp } from '#app'

export interface UseMyVuetifyThemeOptions {
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

export function useMyVuetifyTheme(options: UseMyVuetifyThemeOptions = {}) {
  const { persist = true, cookieName = 'vuetify-theme' } = options
  
  const config = useRuntimeConfig().public.myVuetify
  const theme = useTheme()
  
  // Cookie for persistence
  const themeCookie = persist 
    ? useCookie<string>(cookieName, { default: () => config.defaultTheme || 'light' })
    : ref(config.defaultTheme || 'light')

  // Current theme name
  const currentTheme = computed({
    get: () => theme.global.name.value,
    set: (value: string) => {
      theme.global.name.value = value
      if (persist) {
        themeCookie.value = value
      }
    },
  })

  // Is dark mode
  const isDark = computed(() => theme.global.current.value.dark)

  // Available themes
  const availableThemes = computed(() => Object.keys(config.themes || {}))

  // Theme colors
  const colors = computed(() => theme.global.current.value.colors)

  // Toggle between light and dark
  const toggle = () => {
    currentTheme.value = isDark.value ? 'light' : 'dark'
  }

  // Set specific theme
  const setTheme = (themeName: string) => {
    if (availableThemes.value.includes(themeName)) {
      currentTheme.value = themeName
    } else {
      console.warn(`Theme "${themeName}" not found. Available themes: ${availableThemes.value.join(', ')}`)
    }
  }

  // Get color value
  const getColor = (colorName: string): string | undefined => {
    return colors.value[colorName]
  }

  // Get CSS variable for color
  const getCssVar = (colorName: string): string => {
    return `rgb(var(--v-theme-${colorName}))`
  }

  // Initialize theme from cookie on mount
  if (persist && themeCookie.value && themeCookie.value !== currentTheme.value) {
    currentTheme.value = themeCookie.value
  }

  return {
    // State
    currentTheme,
    isDark,
    availableThemes,
    colors,
    
    // Actions
    toggle,
    setTheme,
    getColor,
    getCssVar,
    
    // Raw theme instance
    theme,
  }
}
