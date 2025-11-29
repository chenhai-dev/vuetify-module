<script setup lang="ts">
const { 
  currentTheme, 
  isDark, 
  availableThemes, 
  setTheme, 
  toggle, 
  colors 
} = useMyVuetifyTheme()

const { 
  defaults, 
  setComponentDefault, 
  resetAllDefaults, 
  presets, 
  applyPreset 
} = useMyVuetifyDefaults()

// Component customization state
const buttonRounded = ref('lg')
const cardRounded = ref('xl')
const inputVariant = ref('outlined')
const inputDensity = ref('comfortable')

// Apply customizations
const applyCustomizations = () => {
  setComponentDefault('VBtn', { rounded: buttonRounded.value })
  setComponentDefault('VCard', { rounded: cardRounded.value })
  setComponentDefault('VTextField', { 
    variant: inputVariant.value, 
    density: inputDensity.value 
  })
  setComponentDefault('VSelect', { 
    variant: inputVariant.value, 
    density: inputDensity.value 
  })
}

const roundedOptions = [
  { title: 'None', value: '0' },
  { title: 'Small', value: 'sm' },
  { title: 'Default', value: undefined },
  { title: 'Large', value: 'lg' },
  { title: 'Extra Large', value: 'xl' },
  { title: 'Pill', value: 'pill' },
]

const variantOptions = [
  { title: 'Outlined', value: 'outlined' },
  { title: 'Filled', value: 'filled' },
  { title: 'Solo', value: 'solo' },
  { title: 'Solo Filled', value: 'solo-filled' },
  { title: 'Solo Inverted', value: 'solo-inverted' },
  { title: 'Underlined', value: 'underlined' },
  { title: 'Plain', value: 'plain' },
]

const densityOptions = [
  { title: 'Default', value: 'default' },
  { title: 'Comfortable', value: 'comfortable' },
  { title: 'Compact', value: 'compact' },
]

const presetsList = Object.keys(presets)
</script>

<template>
  <div>
    <h1 class="text-h4 mb-6">Settings</h1>
    
    <v-row>
      <!-- Theme Settings -->
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-palette</v-icon>
            Theme Settings
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-subheader>Select Theme</v-list-subheader>
              <v-list-item
                v-for="theme in availableThemes"
                :key="theme"
                :active="currentTheme === theme"
                @click="setTheme(theme)"
              >
                <template #prepend>
                  <v-avatar
                    size="32"
                    :color="theme === 'dark' ? 'grey-darken-4' : 'grey-lighten-2'"
                  >
                    <v-icon size="small">
                      {{ theme === 'dark' ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-capitalize">
                  {{ theme }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
            
            <v-divider class="my-4" />
            
            <v-switch
              :model-value="isDark"
              label="Dark Mode"
              color="primary"
              @update:model-value="toggle"
            />
          </v-card-text>
        </v-card>
        
        <!-- Current Colors -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-format-color-fill</v-icon>
            Current Theme Colors
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col
                v-for="(value, name) in colors"
                :key="name"
                cols="6"
                sm="4"
              >
                <div class="d-flex align-center">
                  <div
                    class="rounded mr-2"
                    :style="{ 
                      backgroundColor: value, 
                      width: '24px', 
                      height: '24px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }"
                  />
                  <div>
                    <div class="text-caption font-weight-medium">{{ name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ value }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Component Defaults -->
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-tune</v-icon>
            Component Defaults
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="buttonRounded"
              label="Button Rounded"
              :items="roundedOptions"
              item-title="title"
              item-value="value"
            />
            
            <v-select
              v-model="cardRounded"
              label="Card Rounded"
              :items="roundedOptions"
              item-title="title"
              item-value="value"
            />
            
            <v-select
              v-model="inputVariant"
              label="Input Variant"
              :items="variantOptions"
              item-title="title"
              item-value="value"
            />
            
            <v-select
              v-model="inputDensity"
              label="Input Density"
              :items="densityOptions"
              item-title="title"
              item-value="value"
            />
            
            <div class="d-flex gap-2 mt-4">
              <v-btn color="primary" @click="applyCustomizations">
                Apply Changes
              </v-btn>
              <v-btn variant="outlined" @click="resetAllDefaults">
                Reset All
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Presets -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Presets
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                v-for="preset in presetsList"
                :key="preset"
                variant="tonal"
                @click="applyPreset(preset as any)"
              >
                {{ preset }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Preview -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-eye</v-icon>
            Preview
          </v-card-title>
          <v-card-text>
            <v-text-field label="Sample Text Field" />
            <v-select label="Sample Select" :items="['Option 1', 'Option 2']" class="mt-4" />
            <div class="d-flex gap-2 mt-4">
              <v-btn color="primary">Primary Button</v-btn>
              <v-btn color="secondary">Secondary Button</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Current Defaults Display -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-code-json</v-icon>
            Current Defaults Configuration
          </v-card-title>
          <v-card-text>
            <pre class="text-body-2 pa-4 bg-grey-lighten-4 rounded">{{ JSON.stringify(defaults, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
