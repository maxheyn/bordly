<script setup lang="ts">
import { ListboxRoot } from 'reka-ui'
import BingoOptionsList from '@/views/bingo-board/BingoOptionsList.vue'

defineProps<{
    selectedGoals: string[]
}>()

const allGoals = defineModel<string[]>('allGoals')
const queuedSelectedGoals = defineModel<string[]>('queuedSelectedGoals')

function handleDeleteGoal(idx: number) {
    allGoals.value.splice(idx, 1)
    queuedSelectedGoals.value.splice(idx, 1)
}
</script>

<template>
    <div class="flex flex-col gap-y-2">
        <div class="flex justify-between">
            <span class="font-medium text-indigo-dye">
            Select your options… ({{
                queuedSelectedGoals?.filter((g) => allGoals?.includes(g))?.length ?? 0
            }}
            of {{ allGoals?.length ?? 0 }})
            </span>
            <div class="flex">
                <span
                    @click="queuedSelectedGoals = [...allGoals!]"
                    class="cursor-pointer mr-1 hover:text-blue-700 text-blue-500 hover:underline"
                >
                    Select all
                </span>
                <span
                    @click="queuedSelectedGoals = []"
                    class="cursor-pointer ml-1 hover:text-blue-700 text-blue-500 hover:underline"
                >
                    Deselect all
                </span>
            </div>
        </div>
        <ListboxRoot
            v-model="queuedSelectedGoals"
            class="border rounded-lg overflow-y-auto max-h-[600px]"
            multiple
        >
            <BingoOptionsList
                :all-goals="allGoals"
                :selected-goals="selectedGoals"
                @delete-goal="handleDeleteGoal"
            />
        </ListboxRoot>
    </div>
</template>
