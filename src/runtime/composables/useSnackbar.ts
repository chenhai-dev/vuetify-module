import { ref } from 'vue'
import type { SnackbarOptions, SnackbarState } from '../../types'

// Shared state for global snackbar
const state = ref<SnackbarState>({
    visible: false,
    message: '',
    color: 'success',
    timeout: 3000,
    location: 'top end',
    icon: undefined,
})

/**
 * Snackbar notification composable for Admin Portal
 * Provides global snackbar notifications with preset methods
 */
export function useSnackbar() {
    /**
     * Show a snackbar with custom options
     */
    const show = (options: SnackbarOptions) => {
        state.value = {
            visible: true,
            message: options.message,
            color: options.color || 'success',
            timeout: options.timeout ?? 3000,
            location: options.location || 'top end',
            icon: options.icon,
        }
    }

    /**
     * Show a success snackbar
     */
    const success = (message: string, options?: Partial<Omit<SnackbarOptions, 'message' | 'color'>>) => {
        show({
            message,
            color: 'success',
            icon: 'mdi-check-circle',
            ...options,
        })
    }

    /**
     * Show an error snackbar
     */
    const error = (message: string, options?: Partial<Omit<SnackbarOptions, 'message' | 'color'>>) => {
        show({
            message,
            color: 'error',
            icon: 'mdi-alert-circle',
            timeout: 5000, // Errors show longer by default
            ...options,
        })
    }

    /**
     * Show an info snackbar
     */
    const info = (message: string, options?: Partial<Omit<SnackbarOptions, 'message' | 'color'>>) => {
        show({
            message,
            color: 'info',
            icon: 'mdi-information',
            ...options,
        })
    }

    /**
     * Show a warning snackbar
     */
    const warning = (message: string, options?: Partial<Omit<SnackbarOptions, 'message' | 'color'>>) => {
        show({
            message,
            color: 'warning',
            icon: 'mdi-alert',
            ...options,
        })
    }

    /**
     * Hide the snackbar
     */
    const hide = () => {
        state.value.visible = false
    }

    return {
        // Full state for component binding
        state,

        // Methods
        show,
        success,
        error,
        info,
        warning,
        hide,
    }
}
