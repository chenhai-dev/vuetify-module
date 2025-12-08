import { VuetifyDateAdapter } from 'vuetify/date/adapters/vuetify'
import DateFnsAdapter from '@date-io/date-fns'
import DayJsAdapter from '@date-io/dayjs'
import LuxonAdapter from '@date-io/luxon'
import MomentAdapter from '@date-io/moment'

export const dateAdapters: Record<string, () => Promise<unknown>> = {
  'vuetify': async () => ({ adapter: VuetifyDateAdapter }),
  'date-fns': async () => ({ adapter: DateFnsAdapter }),
  'dayjs': async () => ({ adapter: DayJsAdapter }),
  'luxon': async () => ({ adapter: LuxonAdapter }),
  'moment': async () => ({ adapter: MomentAdapter }),
  // Add more as needed
}

export function setDateAdapter(adapter: string = 'vuetify') {
  // For now, return Vuetify adapter
  // Users can extend with date-fns, dayjs, etc.
  return dateAdapters[adapter] || dateAdapters['vuetify']
}
