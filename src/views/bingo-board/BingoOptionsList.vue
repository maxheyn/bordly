<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted } from 'vue'
import { ListboxContent, ListboxItem, injectListboxRootContext } from 'reka-ui'
import { Icon } from '@iconify/vue'

const props = defineProps<{
    allGoals?: string[]
}>()

const emit = defineEmits<{
    deleteGoal: [idx: number]
}>()

const rootContext = injectListboxRootContext()

onBeforeMount(() => {
    rootContext.focusable.value = false
})

onMounted(() => {
    nextTick(() => {
        rootContext.focusable.value = true
    })
})
</script>

<template>
    <ListboxContent class="divide-y">
        <ListboxItem
            v-for="(item, idx) in allGoals"
            :key="`goal-${idx}`"
            :value="item"
            class="px-2 text-indigo-dye py-1.5 cursor-pointer flex items-center data-[state=checked]:bg-mint-green font-medium tra"
            :class="{
                'rounded-t-lg': idx === 0,
                'rounded-b-lg': idx === allGoals.length - 1,
            }"
        >
            <span class="flex-1">{{ item || '(empty)' }}</span>
            <button
                class="flex items-center cursor-pointer py-1 px-2 rounded-full hover:bg-indigo-dye/20"
                @click.stop.prevent="emit('deleteGoal', idx)"
            >
                <Icon icon="lucide:trash-2" class="mr-1" />
                Remove
            </button>
        </ListboxItem>
    </ListboxContent>
</template>
