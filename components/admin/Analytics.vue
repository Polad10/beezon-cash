<script lang="ts" setup>
import Decimal from 'decimal.js'
import type { Order } from '~/models/Order'
import { OrderStatus } from '~/models/OrderStatus'
import type { Transaction } from '~/models/Transaction'
import { toColorCode, toDisplayString, toTextColorCode, TransactionType } from '~/models/TransactionType'
import type { User } from '~/models/User'

const props = defineProps<{
  allTransactions: Transaction[]
  orders: Order[]
  users: User[]
}>()

onBeforeMount(() => {
  props.allTransactions.forEach((transaction) => {
    transaction.datetime = new Date(transaction.datetime)
    transaction.amount = new Decimal(transaction.amount)
  })

  props.allTransactions.sort((a, b) => {
    return b.datetime.getTime() - a.datetime.getTime()
  })
})

const rowsPerPage = 30

const currentPageNr = ref(1)
const startDate = ref('')
const endDate = ref('')

const pageNr = computed(() => {
  currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
  return currentPageNr.value
})

const maxPageNr = computed(() => {
  return Math.max(Math.ceil(props.allTransactions.length / rowsPerPage), 1)
})

const transactions = computed(() => {
  let result = props.allTransactions

  if (startDate.value) {
    result = result.filter((r) => r.datetime >= new Date(startDate.value))
  }

  if (endDate.value) {
    result = result.filter((r) => r.datetime <= new Date(endDate.value))
  }

  return result
})

const pageTransactions = computed(() => {
  return transactions.value.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const deliveredOrders = computed(() => {
  let orders = props.orders.filter((o) => o.status == OrderStatus.Delivered)

  if (startDate.value) {
    orders = orders.filter((o) => o.date >= new Date(startDate.value))
  }

  if (endDate.value) {
    orders = orders.filter((o) => o.date <= new Date(endDate.value))
  }

  return orders
})

const deliveredWeight = computed(() => {
  let weight = new Decimal(0)

  for (const order of deliveredOrders.value) {
    weight = weight.add(order.weight)
  }

  return weight
})

const income = computed(() => {
  let income = new Decimal(0)

  for (const order of deliveredOrders.value) {
    income = income.add(order.current_price)
  }

  return income
})

const bonusesAdded = computed(() => {
  let bonuses = new Decimal(0)

  for (const transaction of transactions.value) {
    if (transaction.type == TransactionType.Deposit) {
      bonuses = bonuses.add(transaction.amount)
    }
  }

  return bonuses
})

const bonusesWithdrawn = computed(() => {
  let bonuses = new Decimal(0)

  for (const transaction of transactions.value) {
    if (transaction.type == TransactionType.Withdrawal) {
      bonuses = bonuses.add(transaction.amount)
    }
  }

  return bonuses
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
      <div class="flex flex-row gap-5">
        <div class="flex flex-row items-center gap-2">
          <span class="text-sm">Start date</span>
          <Input type="date" class="input-sm" v-model="startDate" />
        </div>
        <div class="flex flex-row items-center gap-2">
          <span class="text-sm">End date</span>
          <Input type="date" class="input-sm" v-model="endDate" />
        </div>
      </div>
    </div>
    <div class="mr-3 mb-5 stats shadow">
      <div class="stat place-items-center">
        <div class="stat-title">Delivered (кг)</div>
        <div class="stat-value">{{ deliveredWeight }}</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Income (₾)</div>
        <div class="stat-value">{{ income }}</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Bonuses added (₾)</div>
        <div class="stat-value">{{ bonusesAdded }}</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Bonuses withdrawn (₾)</div>
        <div class="stat-value">{{ bonusesWithdrawn }}</div>
      </div>
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
