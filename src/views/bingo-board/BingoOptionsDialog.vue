<script setup lang="ts">
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    ListboxRoot,
} from 'reka-ui'
import { nextTick, onBeforeMount, ref } from 'vue'
import { Icon } from '@iconify/vue'
import BingoOptionsListContainer from '@/views/bingo-board/BingoOptionsListContainer.vue'

const allGoals = defineModel<string[]>('allGoals')
const selectedGoals = defineModel<string[]>('selectedGoals')

const queuedSelectedGoals = ref<string[]>([])
const currentGoal = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

function addGoal() {
    const val = currentGoal.value.trim()
    if (!val) return

    if (allGoals.value!.includes(val)) {
        inputRef.value!.setCustomValidity('Item already exists')
        inputRef.value!.checkValidity()
        inputRef.value!.setCustomValidity('')
        return
    }

    allGoals.value!.push(val)
    currentGoal.value = ''
}

const isOpen = ref(false)

function saveChanges() {
    selectedGoals.value = queuedSelectedGoals.value
    isOpen.value = false
}

onBeforeMount(() => {
    nextTick(() => {
        queuedSelectedGoals.value = selectedGoals.value ?? []
    })
})
</script>

<template>
    <DialogRoot v-model:open="isOpen" class="overflow-none">
        <DialogTrigger
            class="px-3 py-2 text-lg whitespace-nowrap flex items-center bg-indigo-dye text-white hover:shadow-md hover:scale-[103%] duration-100 w-fit rounded-xl hover:shadow-gray-500"
        >
            <Icon icon="lucide:pencil" class="mr-2" />
            Update Board&hellip;
        </DialogTrigger>

        <DialogPortal>
            <DialogOverlay class="bg-gray-950/80 fixed inset-0 z-30" />
            <DialogContent
                class="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 z-9999"
            >
                <DialogTitle class="text-indigo-dye m-0 text-4xl font-semibold">
                    Update Board
                </DialogTitle>

                <DialogDescription class="text-indigo-dye mt-[10px] mb-5 font-medium">
                    Add, remove, and select the available goals for the bingo board.<br>
                    Any selected goals will included when randomizing.
                </DialogDescription>

                <div class="flex flex-col w-full space-y-4 mb-2">
                    <div class="flex items-center gap-2">
                        <input
                            ref="inputRef"
                            v-model.trim="currentGoal"
                            @keydown.enter.prevent="addGoal"
                            placeholder="New entry&hellip;"
                            class="flex-1 border px-2 py-1 rounded-lg"
                        />
                        <button
                            type="button"
                            @click="addGoal"
                            class="px-3 py-1 text-lg whitespace-nowrap flex items-center bg-indigo-dye disabled:cursor-default disabled:bg-indigo-dye/70 text-white hover:shadow-sm duration-100 w-fit rounded-xl hover:shadow-gray-500"
                        >
                            <Icon icon="lucide:plus" class="mr-1" />
                            Add
                        </button>
                    </div>
                </div>

                <BingoOptionsListContainer
                    v-model:all-goals="allGoals"
                    v-model:queued-selected-goals="queuedSelectedGoals"
                    :selected-goals="selectedGoals"
                    :class="{ hidden: !allGoals.length }"
                />

                <form @submit.prevent="saveChanges">
                    <div class="mt-6 flex gap-x-2 justify-end">
                        <DialogClose as-child>
                            <button
                                type="button"
                                class="px-3 py-2 text-lg whitespace-nowrap flex items-center bg-white disabled:cursor-default disabled:bg-indigo-dye/70 text-indigo-dye border-ingido-dye border-2 hover:shadow-md hover:scale-[103%] duration-100 w-fit rounded-xl hover:shadow-gray-500"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                class="px-3 py-2 text-lg whitespace-nowrap flex items-center bg-indigo-dye disabled:cursor-default disabled:bg-indigo-dye/70 text-white hover:shadow-md hover:scale-[103%] duration-100 w-fit rounded-xl hover:shadow-gray-500"
                            >
                                <Icon icon="lucide:save" class="mr-2 scale-110" />
                                Save Changes
                            </button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
