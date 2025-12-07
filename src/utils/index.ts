import type { ModuleOptions } from '../module'

/**
 * Add icon CSS based on icon configuration
 */

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
