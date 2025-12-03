import { ref, readonly, computed } from 'vue'
import type { LoadingOptions } from '../../types'

// Shared state for global loading
const isLoading = ref(false)
const loadingText = ref('')
const loadingColor = ref('primary')
const loadingStack = ref(0)

/**
 * Loading state composable for BBO Admin Portal
 * Provides global loading state management with async wrapper
 */
export function useLoading() {
    // Computed loading state
    const loading = computed(() => isLoading.value)

    /**
     * Start loading state
     */
    const start = (options?: LoadingOptions | string) => {
        loadingStack.value++
        isLoading.value = true

        if (typeof options === 'string') {
            loadingText.value = options
            loadingColor.value = 'primary'
        } else if (options) {
            loadingText.value = options.text || ''
            loadingColor.value = options.color || 'primary'
        } else {
            loadingText.value = ''
            loadingColor.value = 'primary'
        }
    }

    /**
     * Stop loading state
     * Uses a stack to handle nested loading states
     */
    const stop = () => {
        if (loadingStack.value > 0) {
            loadingStack.value--
        }

        if (loadingStack.value === 0) {
            isLoading.value = false
            loadingText.value = ''
        }
    }

    /**
     * Force stop all loading states
     */
    const forceStop = () => {
        loadingStack.value = 0
        isLoading.value = false
        loadingText.value = ''
    }

    /**
     * Update loading text without changing loading state
     */
    const updateText = (text: string) => {
        loadingText.value = text
    }

    /**
     * Wrapper for async functions that automatically manages loading state
     * @param fn - Async function to execute
     * @param options - Loading options or text
     * @returns Result of the async function
     */
    async function withLoading<T>(
        fn: () => Promise<T>,
        options?: LoadingOptions | string
    ): Promise<T> {
        start(options)
        try {
            return await fn()
        } finally {
            stop()
        }
    }

    /**
     * Create a loading wrapper that can be reused
     * @param options - Default loading options
     * @returns A function that wraps async functions
     */
    const createLoadingWrapper = (options?: LoadingOptions | string) => {
        return <T>(fn: () => Promise<T>): Promise<T> => {
            return withLoading(fn, options)
        }
    }

    /**
     * Get current loading stack count (for debugging nested loading states)
     */
    const stackCount = computed(() => loadingStack.value)

    return {
        // State
        loading,
        loadingText: readonly(loadingText),
        loadingColor: readonly(loadingColor),
        isLoading: readonly(isLoading),

        // Stack info (for debugging)
        stackCount,

        // Methods
        start,
        stop,
        forceStop,
        updateText,
        withLoading,
        createLoadingWrapper,
    }
}
