# My Vuetify Module

A custom Nuxt module for Vuetify 3 with enhanced theming, component defaults management, and performance optimizations.

## Features

- 🎨 **Theme Management** - Easy theme switching with cookie persistence
- 🔧 **Component Defaults** - Global and scoped component default props
- ⚡ **Performance Optimized** - Tree-shaking and bundle optimization
- 🧩 **Composables** - Custom composables for theme and defaults
- 📦 **Presets** - Quick component style presets
- 🔌 **Hooks** - Custom hooks for configuration modification

## Installation

```bash
# npm
npm install my-vuetify-module vuetify

# yarn
yarn add my-vuetify-module vuetify

# pnpm
pnpm add my-vuetify-module vuetify
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['my-vuetify-module'],
  
  myVuetify: {
    // Module options
  }
})
```

## Configuration

### Basic Configuration

```typescript
export default defineNuxtConfig({
  modules: ['my-vuetify-module'],
  
  myVuetify: {
    enabled: true,
    defaultTheme: 'light',
    
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#212121',
        },
      },
    },
    
    defaults: {
      VBtn: {
        rounded: 'lg',
        elevation: 2,
      },
      VCard: {
        rounded: 'xl',
        elevation: 4,
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
      },
    },
    
    icons: {
      defaultSet: 'mdi',
      useSvg: false,
    },
    
    performance: {
      treeShaking: true,
    },
  }
})
```

### Full Options

```typescript
interface ModuleOptions {
  // Enable/disable the module
  enabled?: boolean
  
  // Default theme name
  defaultTheme?: string
  
  // Custom theme definitions
  themes?: {
    light?: Partial<ThemeDefinition>
    dark?: Partial<ThemeDefinition>
    [key: string]: Partial<ThemeDefinition> | undefined
  }
  
  // Default component props
  defaults?: Record<string, Record<string, unknown>>
  
  // Icon configuration
  icons?: {
    defaultSet?: 'mdi' | 'fa' | 'mdi-svg' | string
    aliases?: Record<string, string>
    useSvg?: boolean
  }
  
  // SASS/SCSS customization
  styles?: {
    configFile?: string
  }
  
  // SSR configuration
  ssr?: {
    clientWidth?: number
    clientHeight?: number
  }
  
  // Performance optimizations
  performance?: {
    treeShaking?: boolean
    prefetch?: boolean
  }
  
  // Blueprint preset
  blueprint?: 'md1' | 'md2' | 'md3'
  
  // Enable lab components
  labComponents?: boolean
}
```

## Usage

### Theme Management

```vue
<script setup>
const { 
  currentTheme, 
  isDark, 
  toggle, 
  setTheme, 
  availableThemes,
  colors,
  getCssVar 
} = useMyVuetifyTheme()
</script>

<template>
  <div>
    <!-- Toggle dark mode -->
    <v-btn @click="toggle">
      {{ isDark ? 'Light Mode' : 'Dark Mode' }}
    </v-btn>
    
    <!-- Set specific theme -->
    <v-btn @click="setTheme('brand')">
      Brand Theme
    </v-btn>
    
    <!-- Use theme colors -->
    <div :style="{ color: getCssVar('primary') }">
      Styled with primary color
    </div>
  </div>
</template>
```

### Component Defaults

```vue
<script setup>
const { 
  defaults,
  setComponentDefault,
  resetAllDefaults,
  applyPreset 
} = useMyVuetifyDefaults()

// Set custom default
setComponentDefault('VBtn', { 
  rounded: 'pill',
  variant: 'flat' 
})

// Apply a preset
applyPreset('denseForm')
</script>
```

### Available Presets

- `denseForm` - Compact form inputs
- `comfortableForm` - Comfortable form inputs
- `rounded` - Rounded components (pill buttons, xl cards)
- `flat` - Flat components (no elevation)
- `elevated` - Elevated components with shadows

### Scoped Theming

```vue
<template>
  <VThemeProvider theme="dark">
    <!-- Everything inside uses dark theme -->
    <v-card>
      <v-card-text>Dark themed content</v-card-text>
    </v-card>
  </VThemeProvider>
</template>
```

## Custom Hooks

You can modify the module configuration using the `my-vuetify:config` hook:

```typescript
// In your module or plugin
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('my-vuetify:config', (config) => {
      // Modify themes
      config.themes.custom = {
        dark: false,
        colors: {
          primary: '#FF6B35',
        },
      }
      
      // Add defaults
      config.defaults.VBtn = {
        rounded: 'pill',
      }
    })
  }
})
```

## Development

```bash
# Install dependencies
npm install

# Prepare development
npm run dev:prepare

# Start development server
npm run dev

# Build module
npm run prepack

# Run tests
npm run test
```

## License

MIT
