import {computed, reactive} from 'vue'
import {useDefaults as useVuetifyDefaults} from 'vuetify'
export interface ComponentDefaults {
    [componentName: string]: Record<string, unknown>
}

export function useVDefaults() {
    const config = useRuntimeConfig().public.vuetify

    // Get Vuetify's useDefaults
    const vuetifyDefaults = useVuetifyDefaults()

    // Local overrides
    const localOverrides = reactive<ComponentDefaults>({})

    // Merged defaults
    const mergedDefaults = computed(() => ({
        ...config.defaults,
        ...localOverrides,
    }))

    // Set default for a component
    const setComponentDefault = <T extends Record<string, unknown>>(
        componentName: string,
        defaults: T
    ) => {
        localOverrides[componentName] = {
            ...(localOverrides[componentName] || {}),
            ...defaults,
        }
    }

    // Get defaults for a component
    const getComponentDefaults = (componentName: string): Record<string, unknown> => {
        return {
            ...(config.defaults?.[componentName] || {}),
            ...(localOverrides[componentName] || {}),
        }
    }

    // Reset defaults for a component
    const resetComponentDefaults = (componentName: string) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete localOverrides[componentName]
    }

    // Reset all local overrides
    const resetAllDefaults = () => {
        Object.keys(localOverrides).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete localOverrides[key]
        })
    }

    // Common component presets
    const presets = {
        // Dense form preset
        denseForm: () => {
            setComponentDefault('VTextField', {density: 'compact', variant: 'outlined'})
            setComponentDefault('VSelect', {density: 'compact', variant: 'outlined'})
            setComponentDefault('VAutocomplete', {density: 'compact', variant: 'outlined'})
            setComponentDefault('VTextarea', {density: 'compact', variant: 'outlined'})
            setComponentDefault('VCheckbox', {density: 'compact'})
            setComponentDefault('VRadio', {density: 'compact'})
            setComponentDefault('VSwitch', {density: 'compact'})
        },

        // Comfortable form preset
        comfortableForm: () => {
            setComponentDefault('VTextField', {density: 'comfortable', variant: 'outlined'})
            setComponentDefault('VSelect', {density: 'comfortable', variant: 'outlined'})
            setComponentDefault('VAutocomplete', {density: 'comfortable', variant: 'outlined'})
            setComponentDefault('VTextarea', {density: 'comfortable', variant: 'outlined'})
        },

        // Rounded components preset
        rounded: () => {
            setComponentDefault('VBtn', {rounded: 'pill'})
            setComponentDefault('VCard', {rounded: 'xl'})
            setComponentDefault('VTextField', {rounded: 'lg'})
            setComponentDefault('VChip', {rounded: 'pill'})
        },

        // Flat components preset
        flat: () => {
            setComponentDefault('VBtn', {variant: 'flat'})
            setComponentDefault('VCard', {variant: 'flat'})
            setComponentDefault('VAppBar', {flat: true})
        },

        // Elevated components preset
        elevated: () => {
            setComponentDefault('VBtn', {elevation: 2})
            setComponentDefault('VCard', {elevation: 4})
            setComponentDefault('VAppBar', {elevation: 2})
        },
    }

    // Apply a preset
    const applyPreset = (presetName: keyof typeof presets) => {
        const preset = presets[presetName]
        if (preset) {
            preset()
        } else {
            console.warn(`Preset "${presetName}" not found`)
        }
    }


    return {
        // State
        defaults: mergedDefaults,
        localOverrides,

        // Actions
        setComponentDefault,
        getComponentDefaults,
        resetComponentDefaults,
        resetAllDefaults,

        // Presets
        presets,
        applyPreset,

        // Vuetify defaults
        vuetifyDefaults,
    }
}
