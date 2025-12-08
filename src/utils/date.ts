import { VuetifyDateAdapter } from 'vuetify/date/adapters/vuetify'
import type { VuetifyOptions } from '../types'

export function setDateAdapter(options: VuetifyOptions) {
  // For now, return Vuetify adapter
  // Users can extend with date-fns, dayjs, etc.
  return {
    adapter: VuetifyDateAdapter,
    formats: options.date?.formats || {
      weekdayNarrow: { weekday: 'narrow' },
    },
  }
}
