import { ref } from 'vue'
import type { ConfirmDialogOptions, ConfirmDialogState } from '../../types'

// Shared state for global confirm dialog
const state = ref<ConfirmDialogState>({
  visible: false,
  title: 'Confirm',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'primary',
  cancelColor: 'grey',
  persistent: false,
})

// Promise resolvers
let resolvePromise: ((value: boolean) => void) | null = null

/**
 * Confirmation dialog composable for BBO Admin Portal
 * Provides Promise-based confirmation dialogs
 */
export function useConfirmDialog() {
  /**
   * Show a confirmation dialog and return a Promise
   * Resolves to true if confirmed, false if cancelled
   */
  const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    state.value = {
      visible: true,
      title: options.title || 'Confirm',
      message: options.message,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      confirmColor: options.confirmColor || 'primary',
      cancelColor: options.cancelColor || 'grey',
      persistent: options.persistent ?? false,
    }

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  /**
   * Handle confirm action
   */
  const onConfirm = () => {
    state.value.visible = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  /**
   * Handle cancel action
   */
  const onCancel = () => {
    state.value.visible = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  /**
   * Shorthand for delete confirmation
   */
  const confirmDelete = (itemName?: string): Promise<boolean> => {
    return confirm({
      title: 'Delete Confirmation',
      message: itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'error',
    })
  }

  /**
   * Shorthand for save/discard confirmation
   */
  const confirmDiscard = (): Promise<boolean> => {
    return confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      confirmColor: 'warning',
    })
  }

  /**
   * Shorthand for logout confirmation
   */
  const confirmLogout = (): Promise<boolean> => {
    return confirm({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      confirmColor: 'primary',
    })
  }

  return {
    // State for component binding
    state,

    // Methods
    confirm,
    onConfirm,
    onCancel,
    confirmDelete,
    confirmDiscard,
    confirmLogout,
  }
}
