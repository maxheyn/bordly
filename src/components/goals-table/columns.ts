import { computed, h as createVNode } from "vue";
import type { ColumnDef, Table, Row } from "@tanstack/vue-table";
import GoalsTableDropdown from '@/components/goals-table/GoalsTableDropdown.vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { Checkbox } from "@/components/ui/checkbox";

interface Payment {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'success' | 'failed'
    email: string
}

function useSelectAllProxy(table: Table) {
    return computed<boolean>({
        get: () => {
            return table.getIsAllPageRowsSelected()
        },
        set: (val) => {
            return table.toggleAllPageRowsSelected(val)
        },
    })
}

function useRowSelectProxy(row: any) {
    return computed<boolean>({
        get:  () => row.getIsSelected(),
        set: (val) => row.toggleSelected(val),
    })
}

export const selectColumn: ColumnDef<Payment> = {
    id: 'select',
    header: ({ table }) => {
        const selectAll = useSelectAllProxy(table)
        return createVNode('input', {
            type: 'checkbox',
            checked: selectAll.value,
            onChange: (e: Event) => selectAll.value = (e.target as HTMLInputElement).checked,
            'aria-label': 'Select all',
        })
    },
    cell: ({ row }) => {
        const isSelected = useRowSelectProxy(row)
        return createVNode('input', {
            type: 'checkbox',
            checked: isSelected.value,
            onChange: (e: Event) => isSelected.value = (e.target as HTMLInputElement).checked,
            'aria-label': 'Select row',
        })
    },

    enableSorting: false,
    enableHiding: false,
}

const actionsColumn: ColumnDef<Payment> = {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
        const payment = row.original
        return createVNode(
            'div',
            { class: 'relative' },
            createVNode(GoalsTableDropdown, { payment, onExpand: () => {
                console.log('expand')
                row.toggleExpanded()
            } }),
        )
    },
}

const idColumn: ColumnDef<Payment> = {
    accessorKey: 'id',
    header: () => createVNode('div', { class: 'text-left pl-2' }, 'Id'),
    cell: ({ row }) => {
        const id = Number.parseFloat(row.getValue('id'))
        return createVNode('div', { class: 'pl-2 text-left font-medium' }, id)
    },
}

const statusColumn: ColumnDef<Payment> = {
    accessorKey: 'status',
    header: () => createVNode('div', { class: 'text-left' }, 'Status'),
    cell: ({ row }) => {
        const status = row.getValue('status')
        return createVNode('div', { class: 'text-left font-medium capitalize' }, status)
    },
}

const amountColumn: ColumnDef<Payment> = {
    accessorKey: 'amount',
    header: ({ column }) =>
        createVNode('div', { class: 'text-right' }, [
            createVNode(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Amount',
                    createVNode(Icon, { icon: 'lucide:arrow-up-down', class: 'ml-2 h-4 w-4' }),
                ],
            ),
        ]),

    cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('amount'))
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)

        return createVNode('div', { class: 'text-right font-medium' }, formatted)
    },
}

const emailColumn: ColumnDef<Payment> = {
    accessorKey: 'email',
    header: ({ column }) =>
        createVNode(
            Button,
            {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            },
            () => [
                'Email',
                createVNode(Icon, { icon: 'lucide:arrow-up-down', class: 'ml-2 h-4 w-4' }),
            ],
        ),
    cell: ({ row }) => createVNode('div', { class: 'lowercase' }, row.getValue('email')),
}

export const columns: ColumnDef<Payment>[] = [
    selectColumn,
    idColumn,
    statusColumn,
    amountColumn,
    emailColumn,
    actionsColumn,
]
