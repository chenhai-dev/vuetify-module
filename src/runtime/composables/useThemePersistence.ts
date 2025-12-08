import { useCookie } from '#imports'
import { useTheme } from 'vuetify'
import { watch, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

export function useThemePersistence() {
  const theme = useTheme()
  const config = useRuntimeConfig()
  const persistence = config.public.vuetify?.themePersistence ?? {
    enabled: true,
    storage: 'cookie',
    key: 'nuxt-vuetify-theme',
  }

  if (!persistence.enabled) return { theme }

  const key = persistence.key || 'nuxt-vuetify-theme'

  // Cookie-based persistence (SSR compatible)
  if (persistence.storage === 'cookie') {
    const themeCookie = useCookie(key, {
      maxAge: persistence?.cookieOptions?.maxAge ?? 60 * 60 * 24 * 365,
      path: persistence.cookieOptions?.path ?? '/',
      sameSite: persistence.cookieOptions?.sameSite ?? 'lax',
    })

    // Restore theme on mount
    if (themeCookie.value && theme.themes.value[themeCookie.value]) {
      theme.global.name.value = themeCookie.value
    }

    // Watch for changes
    watch(
      () => theme.global.name.value,
      (newTheme) => {
        themeCookie.value = newTheme
      },
    )
  }

  // LocalStorage persistence (client-only)
  if (persistence.storage === 'localStorage') {
    onMounted(() => {
      const saved = localStorage.getItem(key)
      if (saved && theme.themes.value[saved]) {
        theme.global.name.value = saved
      }

      watch(
        () => theme.global.name.value,
        (newTheme) => {
          localStorage.setItem(key, newTheme)
        },
      )
    })
  }

  return {
    theme,
    toggle: () => {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    },
    setTheme: (name: string) => {
      if (theme.themes.value[name]) {
        theme.global.name.value = name
      }
    },
  }
}
