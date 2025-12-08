// Import locale support
// import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { en, fr, es, de } from 'vuetify/locale'
import type { VuetifyOptions } from '../types'

const setLocaleOptions = (options: VuetifyOptions) => {
  const localeMessages = {
    en,
    fr,
    es,
    de,
    // User can provide more
    ...(options.locale?.messages || {}),
  }
  return {
    locale: options.locale?.locale || 'en',
    fallback: options.locale?.fallback || 'en',
    messages: localeMessages,
    rtl: options.locale?.rtl || {},
  }
}
export {
  setLocaleOptions,
}
