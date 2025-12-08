import type { VuetifyOptions } from 'vuetify'

// Type for date adapter
type DateAdapter = VuetifyOptions['date']

/**
 * Required packages for each adapter
 */
const adapterPackages: Record<string, string[]> = {
  'vuetify': ['vuetify'],
  'date-fns': ['@date-io/date-fns', 'date-fns'],
  'dayjs': ['@date-io/dayjs', 'dayjs'],
  'luxon': ['@date-io/luxon', 'luxon'],
  'moment': ['@date-io/moment', 'moment'],
  'js-joda': ['@date-io/js-joda', '@js-joda/core'],
}

/**
 * Load the appropriate date adapter based on configuration
 */
export async function loadDateAdapter(adapterName: string): Promise<DateAdapter | undefined> {
  const packages: string[] = adapterPackages[adapterName] || []

  if (!packages && adapterName !== 'vuetify') {
    console.warn(`[vuetify-module] Unknown date adapter: "${adapterName}"`)
    return undefined
  }
  try {
    switch (adapterName) {
      case 'date-fns': {
        const adapter = (await import('@date-io/date-fns')).default
        return { adapter: adapter }
      }
      case 'luxon': {
        const adapter = (await import('@date-io/luxon')).default
        return { adapter: adapter }
      }
      case 'dayjs': {
        const adapter = (await import('@date-io/dayjs')).default
        return { adapter: adapter }
      }
      case 'moment': {
        const adapter = (await import('@date-io/moment')).default
        return { adapter: adapter }
      }
      default:{
        const { VuetifyDateAdapter } = (await import('vuetify/date/adapters/vuetify'))
        return { adapter: VuetifyDateAdapter }
      }
    }
  }
  catch (error) {
    console.error(error)
    console.error(
      `\n[vuetify-module] ❌ Date adapter "${adapterName}" failed to load.\n`
      + `Please install the required packages:\n\n`
      + `  npm install ${packages.join(' ')}\n\n`
      + `Or use the built-in adapter by setting dateAdapter: 'vuetify'\n`,
    )
    return undefined
  }
}

export async function getDateAdapter(adapterName: string = 'vuetify') {
  return await loadDateAdapter(adapterName)
}
