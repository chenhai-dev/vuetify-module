<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Vutify Module (Nuxt 4)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Vutify module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
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

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add vuetify-module
```

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

That's it! You can now use Vutify Module in your Nuxt app ✨

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


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
