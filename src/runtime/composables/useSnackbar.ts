import { ref, readonly } from 'vue'
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

let resolvePromise: ((value: boolean) => void) | null = null
/**
 * Snackbar notification composable for Admin Portal
 * Provides global snackbar notifications with preset methods
 */
export function useSnackbar() {
  /**
   * Show a snackbar with custom options
   */
  const show = (options: SnackbarOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolvePromise = resolve

      state.value = {
        visible: true,
        message: options.message,
        color: options.color ?? 'info',
        timeout: options.timeout ?? 3000,
        location: options.location ?? 'bottom',
        icon: options.icon,
      }

      // Auto-close after timeout
      if (state.value.timeout > 0) {
        setTimeout(() => {
          close()
        }, state.value.timeout)
      }
    })
  }

  /**
   * Show a success snackbar
   */
  const success = (message: string, options?: Partial<SnackbarOptions>) =>
    show({ message, color: 'success', icon: 'mdi-check-circle', ...options })

  /**
   * Show an error snackbar
   */
  const error = (message: string, options?: Partial<SnackbarOptions>) =>
    show({ message, color: 'error', icon: 'mdi-alert-circle', ...options })

  /**
   * Show an info snackbar
   */
  const info = (message: string, options?: Partial<SnackbarOptions>) =>
    show({ message, color: 'info', icon: 'mdi-information', ...options })

  /**
   * Show a warning snackbar
   */
  const warning = (message: string, options?: Partial<SnackbarOptions>) =>
    show({ message, color: 'warning', icon: 'mdi-alert', ...options })

  const close = () => {
    state.value.visible = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  /**
   * Hide the snackbar
   */
  const hide = () => {
    state.value.visible = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  return {
    // Full state for component binding
    state: readonly(state),

    // Methods
    show,
    close,
    success,
    error,
    info,
    warning,
    hide,
  }
}
