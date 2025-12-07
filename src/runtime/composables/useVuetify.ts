import { computed } from 'vue'
import { useNuxtApp } from '#app'
import type { createVuetify } from 'vuetify'

/**
 * Access the Vuetify instance
 */
export function useVuetify(): ReturnType<typeof createVuetify> {
  const nuxtApp = useNuxtApp()

  if (!nuxtApp.$vuetify) {
    throw new Error('Vuetify is not installed. Make sure the nuxt-vuetify module is configured.')
  }

  return nuxtApp.$vuetify
}

/**
 * Get/set current theme
 */
export function useVuetifyTheme() {
  const vuetify = useVuetify()

  const currentTheme = computed(() => vuetify.theme.current.value)
  const isDark = computed(() => vuetify.theme.current.value.dark)
  const themeName = computed(() => vuetify.theme.name.value)

  function setTheme(name: string) {
    vuetify.theme.global.name.value = name
  }

  function toggleTheme() {
    vuetify.theme.global.name.value = isDark.value ? 'light' : 'dark'
  }

  return {
    currentTheme,
    isDark,
    themeName,
    setTheme,
    toggleTheme,
  }
}

/**
 * Access display/breakpoint information
 */
export function useVuetifyDisplay() {
  const vuetify = useVuetify()

  return {
    // Current breakpoint name
    name: computed(() => vuetify.display.name.value),
    // Breakpoint booleans
    xs: computed(() => vuetify.display.xs.value),
    sm: computed(() => vuetify.display.sm.value),
    md: computed(() => vuetify.display.md.value),
    lg: computed(() => vuetify.display.lg.value),
    xl: computed(() => vuetify.display.xl.value),
    xxl: computed(() => vuetify.display.xxl.value),
    // Size comparisons
    smAndDown: computed(() => vuetify.display.smAndDown.value),
    smAndUp: computed(() => vuetify.display.smAndUp.value),
    mdAndDown: computed(() => vuetify.display.mdAndDown.value),
    mdAndUp: computed(() => vuetify.display.mdAndUp.value),
    lgAndDown: computed(() => vuetify.display.lgAndDown.value),
    lgAndUp: computed(() => vuetify.display.lgAndUp.value),
    // Mobile detection
    mobile: computed(() => vuetify.display.mobile.value),
    mobileBreakpoint: computed(() => vuetify.display.mobileBreakpoint.value),
    // Dimensions
    width: computed(() => vuetify.display.width.value),
    height: computed(() => vuetify.display.height.value),
  }
}

/**
 * Access locale/i18n functionality
 */
export function useVuetifyLocale() {
  const vuetify = useVuetify()

  const currentLocale = computed(() => vuetify.locale.current.value)
  const isRtl = computed(() => vuetify.locale.isRtl.value)

  function setLocale(locale: string) {
    vuetify.locale.current.value = locale
  }

  function t(key: string, ...params: never[]) {
    return vuetify.locale.t(key, ...params)
  }

  return {
    currentLocale,
    isRtl,
    setLocale,
    t,
  }
}
