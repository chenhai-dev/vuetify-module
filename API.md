# API Reference

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoImport` | `boolean \| { labs?: boolean, ignore?: string[] }` | `{ labs: true }` | Enable automatic tree-shaking |
| `styles` | `true \| 'none' \| 'sass' \| { configFile: string }` | `true` | Vuetify styles configuration |
| `disableVuetifyStyles` | `boolean` | `false` | Disable default Vuetify styles |
| `importComposables` | `boolean` | `true` | Auto-import Vuetify composables |
| `prefixComposables` | `boolean` | `true` | Prefix composables with 'V' |
| `transformAssetUrls` | `boolean` | `true` | Transform asset URLs |
| `prefetch` | `boolean` | `true` | Prefetch Vuetify chunks |
| `preload` | `boolean` | `true` | Preload critical chunks |
| `dateAdapter` | `string` | `undefined` | Date adapter for date pickers |

## Vuetify Options

| Option | Type | Description |
|--------|------|-------------|
| `aliases` | `Record<string, string>` | Component aliases |
| `defaults` | `Record<string, object>` | Default component props |
| `display` | `DisplayOptions` | Responsive breakpoints |
| `theme` | `ThemeOptions` | Theme configuration |
| `icons` | `IconOptions` | Icon set configuration |
| `locale` | `LocaleOptions` | Localization settings |
| `ssr` | `boolean` | Enable SSR mode |

## Auto-Imported Composables

| Composable | Source | Description |
|------------|--------|-------------|
| `useTheme` | Vuetify | Theme management |
| `useDisplay` | Vuetify | Responsive breakpoints |
| `useLayout` | Vuetify | Layout management |
| `useLocale` | Vuetify | Localization |
| `useDefaults` | Vuetify | Component defaults |
| `useRtl` | Vuetify | RTL support |
| `useGoTo` | Vuetify | Scroll helper |
| `useDate` | Vuetify | Date utilities |
