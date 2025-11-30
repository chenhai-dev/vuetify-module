<script setup lang="ts">
/**
 * VThemeProvider - A wrapper component for scoped theming
 * Compatible with Nuxt 4 and Vuetify 3
 */
import { computed, provide } from 'vue'
import { VThemeProvider as VuetifyThemeProvider } from 'vuetify/components'
import { useVTheme } from '../composables/useVTheme'

interface Props {
  /**
   * Theme name to apply
   */
  theme?: string

  /**
   * Whether to apply as root theme provider
   * @default false
   */
  root?: boolean

  /**
   * Custom tag to render
   * @default 'div'
   */
  tag?: string

  /**
   * Whether to render with elevated background
   * @default false
   */
  withBackground?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: undefined,
  root: false,
  tag: 'div',
  withBackground: false,
})

const { global, isDark, availableThemes } = useVTheme()

// Computed theme to use
const appliedTheme = computed(() => {
  if (props.theme && availableThemes.value.includes(props.theme)) {
    return props.theme
  }
  return global.name.value
})

// Provide theme context to children
provide('scoped-theme', appliedTheme)
</script>

<template>
  <VuetifyThemeProvider
      :theme="appliedTheme"
      :root="root"
      :tag="tag"
      :with-background="withBackground"
  >
    <slot
        :theme="appliedTheme"
        :is-dark="isDark"
        :available-themes="availableThemes"
    />
  </VuetifyThemeProvider>
</template>