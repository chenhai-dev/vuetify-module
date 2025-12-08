import type { ModuleOptions, VuetifyRuntimeConfig } from '../types'
import type { Nuxt } from '@nuxt/schema'
import type * as consola from 'consola'
import { defu } from 'defu'
import { loadDateAdapter } from '../utils'

/**
 * Generate Vuetify config template for virtual module
 */
export function generateVuetifyConfigTemplate(options: ModuleOptions): string {
  return `
// Auto-generated Vuetify configuration
export const vuetifyOptions = ${JSON.stringify(options.vuetifyOptions, null, 2)}
export const moduleOptions = {
  autoImports: ${options.autoImport},
  importComposables: ${options.importComposables},
  styles: ${JSON.stringify(options.styles)},
}
`
}

export function setVuetifyRuntimeConfig(options: ModuleOptions, nuxt: Nuxt, logger: consola.ConsolaInstance) {
  const runtimeConfig: VuetifyRuntimeConfig = {
    aliases: options.vuetifyOptions.aliases!,
    defaults: options.vuetifyOptions.defaults!,
    theme: options.vuetifyOptions.theme!,
    icons: options.vuetifyOptions.icons!,
    locale: options.vuetifyOptions.locale!,
    ssr: options.vuetifyOptions.ssr!,
    themePersistence: options.themePersistence!,
  }
  /* -----------------------------------------------
  * Blueprint Support
  * --------------------------------------------- */
  if (options.vuetifyOptions?.blueprint) {
    const blueprintName = options.vuetifyOptions.blueprint
    logger.info(`Using Material Design blueprint: ${blueprintName}`)
    runtimeConfig.blueprint = blueprintName
  }
  /* -----------------------------------------------
  * Data Adapter Support
  * --------------------------------------------- */
  if (options.dateAdapter) {
    nuxt.options.build.transpile.push('vuetify/lib')
    const adapterPackage = loadDateAdapter(options.dateAdapter)
    if (adapterPackage !== undefined) {
      logger.info(`Using date adapter: ${options.dateAdapter}`)
      // Pass to runtime config for plugin to use
      runtimeConfig.dateAdapter = options.dateAdapter
    }
    else {
      logger.warn(`Unknown date adapter: ${options.dateAdapter}`)
    }
  }
  nuxt.options.runtimeConfig.public.vuetify = defu(
    nuxt.options.runtimeConfig.public.vuetify || {},
    runtimeConfig,
  )
}
