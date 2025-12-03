import { useDisplay } from 'vuetify'
import { computed } from 'vue'
import type { BreakpointName } from '../../types'

/**
 * Breakpoints composable for BBO Admin Portal
 * Provides responsive breakpoint utilities using Vuetify's display composable
 */
export function useBreakpoints() {
    const display = useDisplay()

    // Computed breakpoint states
    const isMobile = computed(() => display.xs.value || display.sm.value)
    const isTablet = computed(() => display.md.value)
    const isDesktop = computed(() => display.lg.value)
    const isLargeDesktop = computed(() => display.xl.value || display.xxl.value)

    // Individual breakpoint checks
    const isXs = computed(() => display.xs.value)
    const isSm = computed(() => display.sm.value)
    const isMd = computed(() => display.md.value)
    const isLg = computed(() => display.lg.value)
    const isXl = computed(() => display.xl.value)
    const isXxl = computed(() => display.xxl.value)

    // Current breakpoint name
    const currentBreakpoint = computed<BreakpointName>(() => display.name.value as BreakpointName)

    // Viewport dimensions
    const width = computed(() => display.width.value)
    const height = computed(() => display.height.value)

    // Breakpoint thresholds
    const thresholds = computed(() => display.thresholds.value)

    // Mobile check based on Vuetify's mobile detection
    const mobileBreakpoint = computed(() => display.mobile.value)

    // Greater than or equal breakpoint checks
    const isSmAndUp = computed(() => display.smAndUp.value)
    const isMdAndUp = computed(() => display.mdAndUp.value)
    const isLgAndUp = computed(() => display.lgAndUp.value)
    const isXlAndUp = computed(() => display.xlAndUp.value)

    // Less than or equal breakpoint checks
    const isSmAndDown = computed(() => display.smAndDown.value)
    const isMdAndDown = computed(() => display.mdAndDown.value)
    const isLgAndDown = computed(() => display.lgAndDown.value)
    const isXlAndDown = computed(() => display.xlAndDown.value)

    /**
     * Check if current breakpoint matches or is greater than specified
     */
    const isBreakpointAndUp = (breakpoint: BreakpointName): boolean => {
        const order: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
        const currentIndex = order.indexOf(currentBreakpoint.value)
        const targetIndex = order.indexOf(breakpoint)
        return currentIndex >= targetIndex
    }

    /**
     * Check if current breakpoint matches or is less than specified
     */
    const isBreakpointAndDown = (breakpoint: BreakpointName): boolean => {
        const order: BreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
        const currentIndex = order.indexOf(currentBreakpoint.value)
        const targetIndex = order.indexOf(breakpoint)
        return currentIndex <= targetIndex
    }

    /**
     * Check if current breakpoint exactly matches specified
     */
    const isExactBreakpoint = (breakpoint: BreakpointName): boolean => {
        return currentBreakpoint.value === breakpoint
    }

    return {
        // Device type helpers
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,

        // Individual breakpoints
        isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isXxl,

        // Current breakpoint
        currentBreakpoint,

        // Viewport dimensions
        width,
        height,

        // Thresholds
        thresholds,

        // Mobile detection
        mobileBreakpoint,

        // And up checks
        isSmAndUp,
        isMdAndUp,
        isLgAndUp,
        isXlAndUp,

        // And down checks
        isSmAndDown,
        isMdAndDown,
        isLgAndDown,
        isXlAndDown,

        // Methods
        isBreakpointAndUp,
        isBreakpointAndDown,
        isExactBreakpoint,

        // Raw display instance for advanced usage
        display,
    }
}
