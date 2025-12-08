import type { Blueprint } from 'vuetify'

export type BlueprintName = 'md1' | 'md2' | 'md3'

export async function loadBlueprint(name: BlueprintName): Promise<Blueprint> {
  try {
    const blueprints = await import('vuetify/blueprints')
    return blueprints[name]
  }
  catch (error) {
    console.warn(`Failed to load blueprint: ${name}`, error)
    return {}
  }
}

export function getBlueprintDefaults(name: BlueprintName): Blueprint {
  // Provide fallback defaults if blueprint can't be loaded
  const defaults: Record<BlueprintName, Blueprint> = {
    md1: {
      defaults: {
        VBtn: { variant: 'elevated', rounded: false },
        VCard: { variant: 'elevated', rounded: 'md' },
      },
    },
    md2: {
      defaults: {
        VBtn: { variant: 'elevated', rounded: 'sm' },
        VCard: { variant: 'elevated', rounded: 'lg' },
      },
    },
    md3: {
      defaults: {
        VBtn: { variant: 'elevated', rounded: 'xl' },
        VCard: { variant: 'elevated', rounded: 'xl' },
      },
    },
  }
  return defaults[name] || {}
}
