<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVDefaults, useVTheme } from '../../../src/runtime/composables'

const { global, isDark, toggle, availableThemes, setTheme } = useVTheme()
const { applyPreset, resetAllDefaults } = useVDefaults()

const drawer = ref(false)
const selectedPreset = ref<string | null>(null)

const presetOptions = [
  { title: 'Dense Form', value: 'denseForm' },
  { title: 'Comfortable Form', value: 'comfortableForm' },
  { title: 'Rounded', value: 'rounded' },
  { title: 'Flat', value: 'flat' },
  { title: 'Elevated', value: 'elevated' },
]
type preset = keyof { denseForm: () => void, comfortableForm: () => void, rounded: () => void, flat: () => void, elevated: () => void }
const handlePresetChange = (preset: string | null) => {
  resetAllDefaults()
  if (preset) {
    applyPreset(preset as preset)
  }
}

watch(selectedPreset, handlePresetChange)
</script>

<template>
  <VThemeProvider theme="{theme}">
    <v-app>
      <!-- App Bar -->
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-toolbar-title>Vuetify Module (Nuxt 4)</v-toolbar-title>

        <v-spacer />

        <!-- Theme Selector -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
            >
              <v-icon>mdi-palette</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="themeName in availableThemes"
              :key="themeName"
              :active="global.name.value === themeName"
              @click="setTheme(themeName)"
            >
              <v-list-item-title class="text-capitalize">
                {{ themeName }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Dark Mode Toggle -->
        <v-btn
          icon
          @click="toggle"
        >
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        temporary
      >
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            to="/"
          />
          <v-list-item
            prepend-icon="mdi-form-select"
            title="Forms"
            to="/forms"
          />
          <v-list-item
            prepend-icon="mdi-card"
            title="Cards"
            to="/cards"
          />
          <v-list-item
            prepend-icon="mdi-cog"
            title="Settings"
            to="/settings"
          />
        </v-list>

        <v-divider />

        <v-list-subheader>Component Presets</v-list-subheader>
        <v-list>
          <v-list-item
            v-for="presetOption in presetOptions"
            :key="presetOption.value"
            :active="selectedPreset === presetOption.value"
            @click="selectedPreset = selectedPreset === presetOption.value ? null : presetOption.value"
          >
            <v-list-item-title>{{ presetOption.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <v-container>
          <NuxtPage />
        </v-container>
      </v-main>

      <!-- Footer -->
      <v-footer app>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            class="text-center"
            cols="12"
          >
            <span class="text-body-2">
              Current Theme: <strong class="text-capitalize">{{ global.name.value }}</strong>
              | Dark Mode: <strong>{{ isDark ? 'Yes' : 'No' }}</strong>
              | Nuxt 4
            </span>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </VThemeProvider>
</template>
