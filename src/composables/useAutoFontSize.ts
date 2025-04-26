import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'

interface AutoFontSizeOptions {
    maxSize?: number
    minSize?: number
    step?: number
}

interface UseAutoFontSizeReturn {
    fontSize: Ref<number>
    adjustFontSizeToFit: () => void
}

export function useAutoFontSize(
    containerRef: Ref<HTMLElement | null>,
    textRef: Ref<HTMLElement | null>,
    options: AutoFontSizeOptions = {},
): UseAutoFontSizeReturn {
    const { maxSize: maxFontSize = 32, minSize: minFontSize = 8, step: fontSizeStep = 1 } = options

    const fontSize = ref<number>(maxFontSize)

    function adjustFontSizeToFit(): void {
        const containerEl = containerRef.value
        const textEl = textRef.value

        if (!containerEl || !textEl) return

        const containerStyle = getComputedStyle(containerEl)
        const padX =
            parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight)
        const padY =
            parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom)

        const containerWidthInclPadding = containerEl.clientWidth - padX
        const containerHeightInclPadding = containerEl.clientHeight - padY

        const TOLERANCE = 1
        const isOverflowing = (size: number) => {
            textEl.style.fontSize = `${size}px`

            return (
                textEl.scrollWidth > containerWidthInclPadding + TOLERANCE ||
                textEl.scrollHeight > containerHeightInclPadding + TOLERANCE
            )
        }

        let low = minFontSize
        let high = maxFontSize
        let bestFit = minFontSize

        while (low <= high) {
            const mid = Math.floor((low + high) / 2)
            if (isOverflowing(mid)) {
                // too big, shrink
                high = mid - fontSizeStep
            } else {
                // fits—try larger
                bestFit = mid
                low = mid + fontSizeStep
            }
        }

        fontSize.value = bestFit
        textEl.style.fontSize = `${bestFit}px`
    }

    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
        nextTick(adjustFontSizeToFit)
        resizeObserver = new ResizeObserver(() => nextTick(adjustFontSizeToFit))
        if (containerRef.value) resizeObserver.observe(containerRef.value)
    })

    onUnmounted(() => {
        if (resizeObserver && containerRef.value) {
            resizeObserver.unobserve(containerRef.value)
        }
    })

    return { fontSize, adjustFontSizeToFit }
}
