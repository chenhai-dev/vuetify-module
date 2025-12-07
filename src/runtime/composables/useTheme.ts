import { useTheme } from 'vuetify'
import { computed, ref, watch } from 'vue'

const THEME_STORAGE_KEY = 'bbo-admin-theme'

/**
 * Theme management composable for BBO Admin Portal
 * Provides full theme control with persistence support
 */
export function useAppTheme() {
  const theme = useTheme()

  // Computed properties
  const isDark = computed(() => theme.global.current.value.dark)
  const currentTheme = computed(() => theme.global.name.value)
  const colors = computed(() => theme.global.current.value.colors)

  // Theme persistence flag
  const isPersisted = ref(false)

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    theme.global.name.value = newTheme
    if (isPersisted.value) {
      persistTheme()
    }
  }

  /**
   * Set a specific theme by name
   */
  const setTheme = (themeName: string) => {
    theme.global.name.value = themeName
    if (isPersisted.value) {
      persistTheme()
    }
  }

  /**
   * Get a specific color value from current theme
   */
  const getColor = (colorName: string): string => {
    return theme.global.current.value.colors[colorName] || ''
  }

  /**
   * Persist current theme to localStorage
   */
  const persistTheme = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme.global.name.value)
        isPersisted.value = true
      }
      catch (e) {
        console.warn('Failed to persist theme to localStorage:', e)
      }
    }
  }

  /**
   * Load persisted theme from localStorage
   */
  const loadPersistedTheme = () => {
    if (import.meta.client) {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme) {
          theme.global.name.value = savedTheme
          isPersisted.value = true
        }
      }
      catch (e) {
        console.warn('Failed to load persisted theme:', e)
      }
    }
  }

  /**
   * Enable automatic theme persistence
   */
  const enablePersistence = () => {
    isPersisted.value = true
    persistTheme()

    // Watch for theme changes and persist
    watch(currentTheme, () => {
      if (isPersisted.value) {
        persistTheme()
      }
    })
  }

  /**
   * Disable theme persistence
   */
  const disablePersistence = () => {
    isPersisted.value = false
    if (import.meta.client) {
      try {
        localStorage.removeItem(THEME_STORAGE_KEY)
      }
      catch (e) {
        console.warn('Failed to remove persisted theme:', e)
      }
    }
  }

  return {
    // State
    isDark,
    currentTheme,
    colors,
    isPersisted,

    // Methods
    toggleTheme,
    setTheme,
    getColor,
    persistTheme,
    loadPersistedTheme,
    enablePersistence,
    disablePersistence,

    // Raw theme instance for advanced usage
    theme,
  }
}
