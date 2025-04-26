<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAutoFontSize } from '@/composables/useAutoFontSize'

const props = defineProps<{
    text: string
    search?: string | null
    isRandomizing: boolean
    isVictory: boolean
    randomDelay: number
}>()

const checked = defineModel<boolean>('checked')

const searchMatches = computed(() => {
    if (!props.search) return true
    return props.text.toLowerCase().includes(props.search.toLowerCase())
})

const containerRef = ref<HTMLSpanElement | null>(null)
const textRef = ref<HTMLParagraphElement | null>(null)

const { fontSize } = useAutoFontSize(containerRef, textRef, {
    maxSize: 48,
    minSize: 8,
    step: 1,
})
</script>

<template>
    <button
        @click="checked = !checked"
        class="relative font-chewy hover:[&>button]:flex shadow-none hover:translate duration-100"
    >
        <span
            ref="containerRef"
            class="text-indigo-dye overflow-hidden rounded-xl hover:-translate-1 hover:shadow-[10px_10px_3px_0px_rgba(0,_0,_0,_0.1)] transition duration-200 flex items-center justify-center text-center bg-mint-green aspect-square w-full p-[7.5%] cursor-pointer min-h-fit max-h-min"
            :class="{
                'opacity-20': checked && !searchMatches,
                'opacity-20 !text-gray-800': !(checked || searchMatches),
                '!bg-emerald-300': isVictory,
            }"
        >
            <Transition name="bounce" mode="out-in" appear>
                <Icon
                    v-if="isRandomizing"
                    icon="svg-spinners:tadpole"
                    class="w-1/4 h-1/4"
                    key="spinner"
                />
                <p
                    v-else
                    ref="textRef"
                    :key="text"
                    class="select-none break-words text-center"
                    :style="{ fontSize: fontSize + 'px' }"
                >
                    {{ text }}
                </p>
            </Transition>

            <Transition name="bounce">
                <Icon
                    v-if="checked"
                    icon="lucide:x"
                    :weight="800"
                    class="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 text-rose-400 pointer-events-none opacity-65"
                    :class="{
                        'opacity-20': !searchMatches,
                    }"
                />
            </Transition>
        </span>
    </button>
</template>

<style scoped>
.bounce-enter-active {
    animation: bounce-in 0.3s;
}
.bounce-leave-active {
    animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
}
</style>
