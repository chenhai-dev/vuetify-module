import { md1 } from 'vuetify/blueprints/md1'
import { md2 } from 'vuetify/blueprints/md2'
import { md3 } from 'vuetify/blueprints/md3'
import type { VuetifyOptions } from '../types'

// In setup function:
const blueprintMap = { md1, md2, md3 }
const setBlueprints = (options: VuetifyOptions) => {
  return blueprintMap[options.blueprint || 'md3']
}
export {
  setBlueprints,
}
