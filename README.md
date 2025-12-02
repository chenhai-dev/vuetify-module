# Vuetify Module (Nuxt 4)

A custom Nuxt 4 module for Vuetify 3 with enhanced theming, component defaults management, and performance optimizations.

## Features

- 🎨 **Theme Management** - Easy theme switching with cookie persistence
- 🔧 **Component Defaults** - Global and scoped component default props
- ⚡ **Performance Optimized** - Tree-shaking via `vite-plugin-vuetify`
- 🧩 **Composables** - Custom + auto-imported Vuetify composables
- 📦 **Presets** - Quick component style presets
- 🔌 **Hooks** - Custom hooks for configuration modification
- 🖥️ **SSR Ready** - Full SSR support with display configuration
- 🧪 **Lab Components** - Optional experimental Vuetify components
- 📁 **Nuxt 4 Ready** - Built for Nuxt 4's `app/` directory structure

## Requirements

- Nuxt 4.0.0+
- Vuetify 3.0.0+
- Node.js 18+

## Installation

```bash
# npm
npm install vuetify-module vuetify @mdi/font

# yarn
yarn add vuetify-module vuetify @mdi/font

# pnpm
pnpm add vuetify-module vuetify @mdi/font
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Nuxt 4 compatibility date
  compatibilityDate: '2025-01-01',
  
  modules: ['vuetify-module'],
  
  vuetify: {
    // Module options
  }
})
```

## Nuxt 4 Directory Structure

Nuxt 4 uses the new `app/` directory structure:

```
nuxt-app/
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
  
  modules: ['vuetify-module'],
  
  vuetify: {
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

### SSR Configuration

Configure SSR display dimensions for proper server-side rendering. This helps Vuetify calculate responsive breakpoints correctly during SSR:

```typescript
myVuetify: {
  ssr: {
    clientWidth: 1920,   // Default viewport width for SSR
    clientHeight: 1080,  // Default viewport height for SSR
  }
}
```

The SSR configuration is passed to Vuetify's `display` option, which includes:
- Mobile breakpoint detection
- Responsive thresholds (xs, sm, md, lg, xl, xxl)
- Initial client dimensions for hydration

### Tree Shaking

Tree shaking is enabled by default using `vite-plugin-vuetify` and includes:
- Auto-import of Vuetify components (only imports what you use)
- Chunk splitting for Vuetify (separate bundle for better caching)
- SSR optimization with `noExternal` configuration

To disable:

```typescript
myVuetify: {
    performance: {
        treeShaking: false
    }
}
```

### Prefetch

Enable prefetching of Vuetify chunks for faster page navigation:

```typescript
myVuetify: {
  performance: {
    prefetch: true
  }
}
```
When enabled, Vuetify chunks will be prefetched in the background, improving navigation speed between pages.

### Transform Asset URLs

Asset URL transformation is enabled by default using `transformAssetUrls` from `vite-plugin-vuetify`. This allows using aliases and relative paths in Vuetify component attributes:

```vue
<template>
  <!-- These work with transformAssetUrls enabled -->
  <v-img src="~/assets/images/hero.jpg" />
  <v-card image="@/assets/card-bg.png" />
  <v-avatar image="./profile.jpg" />
  <v-carousel-item src="~/assets/slide.jpg" />
</template>
```

Supported components include: `v-img`, `v-card`, `v-card-item`, `v-avatar`, `v-app-bar`, `v-parallax`, `v-carousel-item`, `v-navigation-drawer`, and more.

To disable:

```typescript
myVuetify: {
  transformAssetUrls: false
}
```

## Usage

### Theme Management

The `useVTheme` composable wraps Vuetify's `useTheme` and exposes all its properties, plus additional helpers:

```vue
<script setup lang="ts">
  // Nuxt 4 auto-imports composables
  const {
    // ===== Vuetify useTheme exposed properties =====
    // @see https://vuetifyjs.com/en/api/use-theme/#exposed
    themes,           // Ref<Record<string, ThemeDefinition>> - Raw theme objects (mutable)
    name,             // Ref<string> - Current theme name (readonly, inherited from parent)
    current,          // Ref<ThemeDefinition> - Processed current theme
    computedThemes,   // Ref<Record<string, ThemeDefinition>> - All processed themes
    global,           // { name: Ref<string>, current: Ref<ThemeDefinition> } - Global theme state

    // ===== Helper properties =====
    isDark,           // ComputedRef<boolean> - Is current theme dark
    availableThemes,  // ComputedRef<string[]> - List of theme names
    colors,           // ComputedRef<Record<string, string>> - Current theme colors

    // ===== Actions =====
    toggle,           // () => void - Toggle light/dark with persistence
    setTheme,         // (name: string) => void - Set specific theme with persistence
    getColor,         // (name: string) => string | undefined - Get color value
    getCssVar,        // (name: string) => string - Get CSS variable string

    // ===== Raw Vuetify theme instance =====
    theme,            // Full Vuetify theme instance for advanced usage
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
    
    <!-- Access global theme name -->
    <p>Current theme: {{ global.name.value }}</p>
    
    <!-- Access themes directly (Vuetify API) -->
    <p>Available: {{ Object.keys(themes) }}</p>
    
    <!-- Use theme colors -->
    <div :style="{ color: getCssVar('primary') }">
      Styled with primary color
    </div>
    
    <!-- Mutate themes at runtime (Vuetify API) -->
    <v-btn @click="themes.light.colors.primary = '#FF0000'">
      Change Primary Color
    </v-btn>
  </div>
</template>
```

#### Vuetify Theme API Reference

The composable exposes all properties from Vuetify's `useTheme()`:

| Property | Type | Description |
|----------|------|-------------|
| `themes` | `Ref<Record<string, ThemeDefinition>>` | Raw theme objects, can be mutated to add/update themes |
| `name` | `Ref<string>` | Current theme name (inherited from parent components) |
| `current` | `Ref<ThemeDefinition>` | Processed theme object with auto-generated colors |
| `computedThemes` | `Ref<Record<string, ThemeDefinition>>` | All processed theme objects |
| `global.name` | `Ref<string>` | Global theme name (writable) |
| `global.current` | `Ref<ThemeDefinition>` | Processed global theme object |

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

Modify module configuration using the `vuetify:config` hook:

```typescript
// In your module or plugin
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('vuetify:config', (config) => {
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
    vuetify: {
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

## Best Practices

### SSR Configuration

1. **Always set SSR dimensions** - Helps Vuetify calculate responsive breakpoints during server rendering:
   ```typescript
   myVuetify: {
     ssr: {
       clientWidth: 1920,
       clientHeight: 1080,
     }
   }
   ```

2. **Use `useDisplay` with watchers** - Due to SSR hydration, use `watch` with `immediate: true`:
   ```vue
   <script setup>
   const { lgAndUp } = useDisplay()
   const isMobile = ref(false)
   
   watch(lgAndUp, (val) => {
     isMobile.value = !val
   }, { immediate: true })
   </script>
   ```

3. **SASS configFile with SSR** - The module automatically disables `inlineStyles` when using `styles.configFile` with SSR enabled.

### Performance

1. **Tree shaking is enabled by default** via `vite-plugin-vuetify`
2. **Use prefetch sparingly** - Only enable if navigation speed is critical
3. **Vuetify is chunked separately** for better caching

### Auto-imported Composables

The following Vuetify composables are auto-imported:
- `useTheme`
- `useDisplay`
- `useLayout`
- `useLocale`
- `useDefaults`
- `useRtl`

Plus module composables:
- `useVTheme`
- `useVDefaults`

### Lab Components

Enable experimental Vuetify components:
```typescript
myVuetify: {
  labComponents: true
}
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