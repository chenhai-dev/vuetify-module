import MyVuetifyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyVuetifyModule],
  myVuetify: {
    enabled: true,
    defaultTheme: 'light',
  },
})
