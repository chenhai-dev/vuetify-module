# Nuxt Vuetify Module (Nuxt 4)

A custom Nuxt 4 module for Vuetify 3 with enhanced theming, component defaults management, and performance optimizations.

## Features

- 🎨 **Theme Management** - Easy theme switching with cookie persistence
- 🔧 **Component Defaults** - Global and scoped component default props
- ⚡ **Performance Optimized** - Tree-shaking and bundle optimization
- 🧩 **Composables** - Custom composables for theme and defaults
- 📦 **Presets** - Quick component style presets
- 🔌 **Hooks** - Custom hooks for configuration modification
- 📁 **Nuxt 4 Ready** - Built for Nuxt 4's `app/` directory structure

## Requirements

- Nuxt 4.2.1+
- Vuetify 3.0.0+
- Node.js 18+

## Installation

```bash
# npm
npm install nuxt-vuetify-module vuetify @mdi/font

# yarn
yarn add nuxt-vuetify-module vuetify @mdi/font

# pnpm
pnpm add nuxt-vuetify-module vuetify @mdi/font
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Nuxt 4 compatibility date
  compatibilityDate: '2025-01-01',
  
  modules: ['nuxt-vuetify-module'],
  
  Vuetify: {
    // Module options
  }
})
```

## Nuxt 4 Directory Structure

Nuxt 4 uses the new `app/` directory structure:

```
my-nuxt-app/
├── app/                    # Application code (Nuxt 4)
│   ├── app.vue
│   ├── pages/
│   ├── components/
│   ├── composables/
│   └── layouts/
├── server/                 # Server code
├── public/                 # Static assets
├── nuxt.config.ts
└── package.json
```

## Configuration

### Basic Configuration

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  
  modules: ['nuxt-vuetify-module'],
  
  Vuetify: {
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

### Full Options Interface

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
    disableVuetifyStyles?: boolean
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
<script setup lang="ts">
// Nuxt 4 auto-imports composables
const { 
  currentTheme, 
  isDark, 
  toggle, 
  setTheme, 
  availableThemes,
  colors,
  getCssVar 
} = useVTheme()
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
<script setup lang="ts">
const { 
  defaults,
  setComponentDefault,
  resetAllDefaults,
  applyPreset 
} = useVDefaults()

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

Modify module configuration using the `nuxt-vuetify:config` hook:

```typescript
// In your module or plugin
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('nuxt-vuetify:config', (config) => {
      // Add custom theme
      config.themes.custom = {
        dark: false,
        colors: {
          primary: '#FF6B35',
        },
      }
      
      // Add component defaults
      config.defaults.VBtn = {
        rounded: 'pill',
      }
    })
  }
})
```

## SASS Customization

Create a SASS variables file and reference it in the config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  Vuetify: {
    styles: {
      configFile: '~/assets/scss/vuetify-settings.scss',
    },
  },
})
```

```scss
// assets/scss/vuetify-settings.scss
@forward 'vuetify/settings' with (
  $button-height: 44px,
  $button-border-radius: 8px,
  $card-border-radius: 12px,
);
```

## Development

```bash
# Install dependencies
npm install

# Prepare development
npm run dev:prepare

# Start development server (uses playground/)
npm run dev

# Build module
npm run prepack

# Run tests
npm run test
```

## Migration from Nuxt 3

If migrating from Nuxt 3:

1. Move your app code to the `app/` directory
2. Update `compatibilityDate` to `'2025-01-01'` or later
3. Update peer dependency to `nuxt: ^4.2.1`
4. Check for any deprecated APIs

## License

MIT
