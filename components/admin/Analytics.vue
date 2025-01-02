<script lang="ts" setup>
import Decimal from 'decimal.js'
import type { Order } from '~/models/Order'
import type { Transaction } from '~/models/Transaction'
import { toColorCode, toDisplayString, toTextColorCode, TransactionType } from '~/models/TransactionType'
import type { User } from '~/models/User'

const props = defineProps<{
  transactions: Transaction[]
  orders: Order[]
  users: User[]
}>()

onBeforeMount(() => {
  props.transactions.forEach((transaction) => {
    transaction.datetime = new Date(transaction.datetime)
    transaction.amount = new Decimal(transaction.amount)
  })

  props.transactions.sort((a, b) => {
    return b.datetime.getTime() - a.datetime.getTime()
  })
})

const rowsPerPage = 30

const currentPageNr = ref(1)

const pageNr = computed(() => {
  currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
  return currentPageNr.value
})

const maxPageNr = computed(() => {
  return Math.max(Math.ceil(props.transactions.length / rowsPerPage), 1)
})

const pageTransactions = computed(() => {
  return props.transactions.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

function getOrderCode(transaction: Transaction) {
  return props.orders.find((o) => o.id === transaction.order_id)?.code
}

function getUserName(transaction: Transaction) {
  const user = props.users.find((u) => u.id === transaction.user_id)

  return `${user?.first_name} ${user?.last_name}`
}
</script>

<template>
  <div class="flex flex-col grow">
    <div class="flex flex-row min-h-12 mr-3 justify-between items-center">
      <span class="text-2xl font-bold">Analytics</span>
    </div>
    <div class="flex flex-col bg-white mr-3 mb-5 grow">
      <table class="table table-sm">
        <thead>
          <tr class="bg-base-200">
            <th>DATE</th>
            <th>ORDER CODE</th>
            <th>CLIENT</th>
            <th>ACTION</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in pageTransactions" :key="transaction.id">
            <td>{{ transaction.datetime.toLocaleDateString() }}</td>
            <td>{{ getOrderCode(transaction) }}</td>
            <td>{{ getUserName(transaction) }}</td>
            <td>
              <div
                class="badge badge-outline rounded-lg p-3"
                :class="[`bg-[${toColorCode(transaction.type)}]`, `text-[${toTextColorCode(transaction.type)}]`]"
              >
                {{ toDisplayString(transaction.type) }}
              </div>
            </td>
            <td>
              <span v-if="transaction.type == TransactionType.Withdrawal">- </span>
              <span v-else>+ </span>
              {{ transaction.amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AdminPagination v-model="pageNr" :max-page-nr="maxPageNr" />
  </div>
</template>
