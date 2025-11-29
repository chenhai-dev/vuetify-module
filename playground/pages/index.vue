<script setup lang="ts">
const { currentTheme, isDark, colors, getCssVar } = useMyVuetifyTheme()

const features = [
  {
    icon: 'mdi-palette',
    title: 'Theme Management',
    description: 'Easy theme switching with persistence support',
  },
  {
    icon: 'mdi-tune-variant',
    title: 'Component Defaults',
    description: 'Global and local component default management',
  },
  {
    icon: 'mdi-lightning-bolt',
    title: 'Performance',
    description: 'Tree-shaking and optimized bundle size',
  },
  {
    icon: 'mdi-vuejs',
    title: 'Composables',
    description: 'Custom composables for theme and defaults',
  },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="pa-8 text-center" color="primary" dark>
          <h1 class="text-h3 font-weight-bold mb-4">
            My Vuetify Module
          </h1>
          <p class="text-h6 font-weight-regular mb-6">
            A custom Nuxt module for Vuetify with theming and performance optimizations
          </p>
          <v-btn color="white" size="large" variant="flat">
            Get Started
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Features Grid -->
    <v-row>
      <v-col v-for="feature in features" :key="feature.title" cols="12" md="6" lg="3">
        <v-card class="h-100">
          <v-card-item>
            <template #prepend>
              <v-icon :icon="feature.icon" color="primary" size="48" />
            </template>
            <v-card-title>{{ feature.title }}</v-card-title>
          </v-card-item>
          <v-card-text>
            {{ feature.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Theme Colors Display -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-palette</v-icon>
            Current Theme Colors
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(value, name) in colors"
                :key="name"
                cols="6"
                sm="4"
                md="3"
                lg="2"
              >
                <div
                  class="pa-4 rounded-lg text-center"
                  :style="{ backgroundColor: value, color: isDark ? '#fff' : '#000' }"
                >
                  <div class="text-caption font-weight-bold">{{ name }}</div>
                  <div class="text-caption">{{ value }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Demo -->
    <v-row class="mt-8">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Button Variants</v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap gap-2">
              <v-btn color="primary">Primary</v-btn>
              <v-btn color="secondary">Secondary</v-btn>
              <v-btn color="success">Success</v-btn>
              <v-btn color="error">Error</v-btn>
              <v-btn color="warning">Warning</v-btn>
              <v-btn color="info">Info</v-btn>
            </div>
            <div class="d-flex flex-wrap gap-2 mt-4">
              <v-btn color="primary" variant="outlined">Outlined</v-btn>
              <v-btn color="primary" variant="text">Text</v-btn>
              <v-btn color="primary" variant="tonal">Tonal</v-btn>
              <v-btn color="primary" variant="plain">Plain</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Alert Variants</v-card-title>
          <v-card-text>
            <v-alert type="success" class="mb-2">
              Success alert message
            </v-alert>
            <v-alert type="info" class="mb-2">
              Info alert message
            </v-alert>
            <v-alert type="warning" class="mb-2">
              Warning alert message
            </v-alert>
            <v-alert type="error">
              Error alert message
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
