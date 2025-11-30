<script setup lang="ts">
import {ref, watch} from "vue";

const { global, isDark, toggle, availableThemes, setTheme } = useVTheme()
const { presets,applyPreset, resetAllDefaults } = useVDefaults()

const drawer = ref(false)
const selectedPreset = ref<string | null>(null)

const presetOptions = [
  { title: 'Dense Form', value: 'denseForm' },
  { title: 'Comfortable Form', value: 'comfortableForm' },
  { title: 'Rounded', value: 'rounded' },
  { title: 'Flat', value: 'flat' },
  { title: 'Elevated', value: 'elevated' },
]

const handlePresetChange = (preset: string | null) => {
  resetAllDefaults()
  if (preset) {
    applyPreset(preset as (keyof typeof presets))
  }
}

watch(selectedPreset, handlePresetChange)
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Vuetify Module (Nuxt 4)</v-toolbar-title>

      <v-spacer />

      <!-- Theme Selector -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
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
      <v-btn icon @click="toggle">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/" />
        <v-list-item prepend-icon="mdi-form-select" title="Forms" to="/forms" />
        <v-list-item prepend-icon="mdi-card" title="Cards" to="/cards" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" />
      </v-list>

      <v-divider />

      <v-list-subheader>Component Presets</v-list-subheader>
      <v-list>
        <v-list-item
            v-for="preset in presetOptions"
            :key="preset.value"
            :active="selectedPreset === preset.value"
            @click="selectedPreset = selectedPreset === preset.value ? null : preset.value"
        >
          <v-list-item-title>{{ preset.title }}</v-list-item-title>
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
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <span class="text-body-2">
            Current Theme: <strong class="text-capitalize">{{ global.name.value }}</strong>
            | Dark Mode: <strong>{{ isDark ? 'Yes' : 'No' }}</strong>
            | Nuxt 4
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>