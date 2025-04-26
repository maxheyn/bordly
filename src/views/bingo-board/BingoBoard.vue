<script setup lang="ts">
import BingoTile from './BingoTile.vue'
import { EXAMPLE_BINGO } from '@/data.ts'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import BingoOptionsDialog from './BingoOptionsDialog.vue'
import { create as createConfetti } from 'canvas-confetti'
import { Icon } from '@iconify/vue'
import { DialogTrigger } from "reka-ui";

const RANDOMIZE_LOADING_DURATION_SECONDS = 0.7

const gridSize = ref<number>(5)
const totalTilesCount = computed(() => gridSize.value ** 2)
const gridClass = computed(() => `grid-cols-${gridSize.value}`)

const allGoals = ref<string[]>([])
const selectedGoals = ref<string[]>([])
const displayGoals = computed(() => {
    const slice = selectedGoals.value.slice(0, totalTilesCount.value)
    while (slice.length < totalTilesCount.value) slice.push('')
    return slice
})
const search = ref<string>()

const isRandomizing = ref(false)
const tileDelays = ref<Record<string, number>>({})
function randomizeBoard() {
    isRandomizing.value = true
    const jitter = 0.3
    tileDelays.value = Object.fromEntries(
        selectedGoals.value.map((goal) => [
            goal,
            RANDOMIZE_LOADING_DURATION_SECONDS + (Math.random() * 2 - 1) * jitter,
        ]),
    )
    const maxDelay = Math.max(...Object.values(tileDelays.value))
    setTimeout(() => {
        const array = selectedGoals.value
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        isRandomizing.value = false
    }, maxDelay * 1000)

    checkedTiles.value = Array(gridSize.value ** 2).fill(false)
}

const checkedTiles = ref<boolean[]>(Array(totalTilesCount.value).fill(false))
const victoryResults = ref<number[]>([])

function checkForVictory(): number[] {
    const dimension = gridSize.value
    const checkedStates = checkedTiles.value
    const wins = new Set<number>()

    const getRow = (r: number) => Array.from({ length: dimension }, (_, c) => r * dimension + c)
    const getCol = (c: number) => Array.from({ length: dimension }, (_, r) => r * dimension + c)
    const getMainDiag = () => Array.from({ length: dimension }, (_, i) => i * dimension + i)
    const getAntiDiag = () =>
        Array.from({ length: dimension }, (_, i) => i * dimension + (dimension - 1 - i))

    const lines = [
        ...Array.from({ length: dimension }, (_, r) => getRow(r)),
        ...Array.from({ length: dimension }, (_, c) => getCol(c)),
        getMainDiag(),
        getAntiDiag(),
    ]

    lines.forEach((line) => {
        if (line.every((i) => checkedStates[i])) {
            line.forEach((i) => wins.add(i))
        }
    })

    return Array.from(wins)
}

watch(
    checkedTiles,
    () => {
        victoryResults.value = checkForVictory()
    },
    { deep: true },
)

watch(
    allGoals,
    (val) => {
        localStorage.setItem('bordly_bingoAllGoals', JSON.stringify(val))
        selectedGoals.value = selectedGoals.value.filter((g) => val.includes(g))
    },
    { deep: true },
)

watch(
    selectedGoals,
    (val) => {
        localStorage.setItem('bordly_bingoSelectedGoals', JSON.stringify(val))
    },
    { deep: true },
)

watch(gridSize, (val) => {
    checkedTiles.value = Array(val ** 2).fill(false)
    victoryResults.value = []
})

onMounted(() => {
    const storedAll = localStorage.getItem('bordly_bingoAllGoals')
    allGoals.value = storedAll ? JSON.parse(storedAll) : []
    const storedSel = localStorage.getItem('bordly_bingoSelectedGoals')
    selectedGoals.value = storedSel ? JSON.parse(storedSel) : [...allGoals.value]
    selectedGoals.value = selectedGoals.value.filter((g) => allGoals.value.includes(g))

    if (confettiCanvas.value) {
        confetti = createConfetti(confettiCanvas.value, { resize: true })
    }
})

const confettiCanvas = ref<HTMLCanvasElement | null>(null)
let confetti: ReturnType<typeof createConfetti>

function spawnConfetti() {
    if (!confetti) return

    confetti({
        particleCount: 25,
        angle: -45,
        spread: 90,
        origin: { x: 0, y: 0 },
        disableForReducedMotion: true,
    })

    confetti({
        particleCount: 25,
        angle: -135,
        spread: 90,
        origin: { x: 1, y: 0 },
        disableForReducedMotion: true,
    })

    confetti({
        particleCount: 25,
        angle: 45,
        spread: 90,
        origin: { x: 0, y: 1 },
        disableForReducedMotion: true,
    })

    confetti({
        particleCount: 25,
        angle: 135,
        spread: 90,
        origin: { x: 1, y: 1 },
        disableForReducedMotion: true,
    })
}

watch(victoryResults, (newWins, oldWins) => {
    // Only spawn confetti if a new action actually cause a new win,
    // rather than just after any action if a win already exists.
    if (newWins.length && newWins.length > oldWins.length) {
        spawnConfetti()
    }
})
</script>

<template>
    <div class="relative flex flex-col max-md:p-6">
        <div class="flex justify-between items-end px-8 mt-4">
            <div class="inline-flex items-end gap-x-3 w-1/3">
                <button
                    type="button"
                    class="px-3 py-2 text-lg whitespace-nowrap flex items-center bg-indigo-dye disabled:cursor-default disabled:bg-indigo-dye/70 text-white hover:shadow-md hover:scale-[103%] duration-100 w-fit rounded-xl hover:shadow-gray-500"
                    @click="randomizeBoard"
                    :disabled="isRandomizing"
                >
                    <Icon icon="lucide:shuffle" class="mr-2" />
                    Randomize Board
                </button>

                <BingoOptionsDialog v-model:selected-goals="selectedGoals" :all-goals="allGoals" />
            </div>

            <div class="flex justify-center text-white font-chewy w-1/3">
                <div class="flex items-center bg-indigo-dye w-fit rounded-xl px-3 gap-x-3">
                    <button
                        class="p-3 hover:bg-mint-green/30 disabled:hover:bg-mint-green/10 rounded-xl disabled:cursor-not-allowed"
                        @click="gridSize = Math.max(3, gridSize - 1)"
                        :disabled="gridSize <= 3"
                    >
                        <Icon icon="lucide:minus" />
                    </button>
                    <p class="text-xl">{{ gridSize }} x {{ gridSize }}</p>

                    <button
                        class="p-3 hover:bg-mint-green/30 disabled:hover:bg-mint-green/10 rounded-xl disabled:cursor-not-allowed"
                        @click="gridSize = Math.min(12, gridSize + 1)"
                        :disabled="gridSize >= 12"
                    >
                        <Icon icon="lucide:plus" />
                    </button>
                </div>
            </div>

            <input
                v-model="search"
                type="text"
                placeholder="Search the board..."
                class="border h-fit w-1/3 py-1.5 px-3 rounded-lg"
            />
        </div>

        <div class="grid items-center gap-4 px-8 pb-8 pt-3" :class="gridClass">
            <BingoTile
                v-for="(text, idx) in displayGoals"
                :key="text + idx"
                :text="text"
                :search="search"
                :is-randomizing="isRandomizing"
                :is-victory="victoryResults.includes(idx)"
                :random-delay="tileDelays[text] ?? RANDOMIZE_LOADING_DURATION_SECONDS"
                v-model:checked="checkedTiles[idx]"
            />
        </div>
    </div>

    <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-50 w-full h-full" />
</template>
