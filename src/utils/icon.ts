import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as mdiSvgAliases, mdi as mdiSvg } from 'vuetify/iconsets/mdi-svg'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'
import { aliases as faSvgAliases, fa as faSvg } from 'vuetify/iconsets/fa-svg'
import type { IconOptions } from 'vuetify'
import type { VuetifyOptions } from '../types'
import type { Nuxt } from '@nuxt/schema'

// Map icon sets

const setIcon = (options: VuetifyOptions) => {
  const iconSetsMap: { [key: string]: Omit<IconOptions, 'defaultSet'> } = {
    'mdi': { aliases: mdiAliases, sets: { mdi } },
    'mdi-svg': { aliases: mdiSvgAliases, sets: { mdi: mdiSvg } },
    'fa': { aliases: faAliases, sets: { fa } },
    'fa-svg': { aliases: faSvgAliases, sets: { fa: faSvg } },
  }
  const defaultSet = options.icons?.defaultSet || 'mdi'
  const iconConfig: Omit<IconOptions, 'defaultSet'> = iconSetsMap[defaultSet] || { aliases: mdiAliases, sets: { mdi } }

  const icons: IconOptions = {
    defaultSet,
    aliases: {
      ...iconConfig.aliases,
      ...(options.icons?.aliases || {}),
    },
    sets: {
      ...iconConfig.sets,
      ...(options.icons?.sets || {}),
    },
  }
  return icons
}
/**
 * Add icon CSS based on icon configuration
 */
function addIconStyles(nuxt: Nuxt, icons?: VuetifyOptions['icons']) {
  if (!icons) return

  const iconCssMap: Record<string, string> = {
    mdi: '@mdi/font/css/materialdesignicons.css',
    fa: '@fortawesome/fontawesome-free/css/all.css',
    fa4: '@fortawesome/fontawesome-free/css/v4-shims.css',
    md: 'material-design-icons-iconfont/dist/material-design-icons.css',
  }

  const defaultSet = icons.defaultSet || 'mdi'

  // Don't add CSS for SVG icon sets
  if (defaultSet.includes('svg')) {
    return
  }

  const cssPath = iconCssMap[defaultSet]
  if (cssPath && !nuxt.options.css.includes(cssPath)) {
    nuxt.options.css.push(cssPath)
  }
}
export {
  setIcon,
  addIconStyles,
}
