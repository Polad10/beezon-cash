<script setup lang="ts">
import type { Order } from '~/models/Order'
import type { Message } from '~/models/Message'
import type { User } from '~/models/User'
import type { Transaction } from '~/models/Transaction'
import axios from 'axios'
import OrdersGeRu from '~/components/admin/OrdersGeRu.vue'
import type { OrderGeRu } from '~/models/OrderGeRu'

enum ActiveTab {
  Users,
  Orders,
  OrdersGeRu,
  Messages,
  Analytics,
}

const users = (await useFetch<User[]>('/api/users')).data
const orders = (await useFetch<Order[]>('/api/orders')).data
const orderGeRu = (await useFetch<OrderGeRu[]>('/api/geru/admin/orders')).data
const messages = (await useFetch<Message[]>('/api/messages')).data
const transactions = (await useFetch<Transaction[]>('/api/transactions')).data

const activeTab = ref<ActiveTab>()
const showErrorToast = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (process.client) {
    const storedActiveTab = localStorage.getItem('activeTab')

    if (storedActiveTab) {
      activeTab.value = Number(storedActiveTab)
    } else {
      activeTab.value = ActiveTab.Users
    }
  }
})

function setActiveTab(tab: ActiveTab) {
  activeTab.value = tab
  localStorage.setItem('activeTab', tab.toString())
}

async function deleteUser(user: User) {
  try {
    await axios.delete(`/api/users/${user.id}`)
    users.value = users.value!.filter((u) => u.id !== user.id)
    orders.value = orders.value!.filter((o) => o.user_id !== user.id)
  } catch (ex) {
    errorMessage.value = 'Something went wrong. Please try again later.'
    showToast(showErrorToast)
  }
}

async function deleteOrder(order: Order) {
  try {
    await axios.delete(`/api/orders/${order.id}`)
    orders.value = orders.value?.filter((o) => o.id !== order.id)!
  } catch (ex) {
    errorMessage.value = 'Something went wrong. Please try again later.'
    showToast(showErrorToast)
  }
}

async function deleteGeRuOrder(order: OrderGeRu) {}

async function deleteMessage(message: Message) {
  try {
    await axios.delete(`/api/messages/${message.id}`)
    messages.value = messages.value?.filter((m) => m.id !== message.id)!
  } catch (ex) {
    errorMessage.value = 'Something went wrong. Please try again later.'
    showToast(showErrorToast)
  }
}
</script>

<template>
  <div data-theme="cmyk" class="flex flex-col w-full h-full">
    <div class="navbar">
      <p class="text-2xl font-bold">BEEZON CASH</p>
    </div>
    <div class="flex flex-row my-3 pr-3 bg-zinc-100 grow overflow-auto">
      <div class="flex flex-col w-40">
        <div class="h-12"></div>
        <ul class="menu w-40 rounded-box py-0">
          <li>
            <button :class="{ active: activeTab == ActiveTab.Users }" @click="setActiveTab(ActiveTab.Users)">
              Users
            </button>
          </li>
          <li>
            <button :class="{ active: activeTab == ActiveTab.Orders }" @click="setActiveTab(ActiveTab.Orders)">
              Orders &nbsp;&nbsp; RU - GE
            </button>
          </li>
          <li>
            <button :class="{ active: activeTab == ActiveTab.OrdersGeRu }" @click="setActiveTab(ActiveTab.OrdersGeRu)">
              Orders &nbsp;&nbsp; GE - RU
            </button>
          </li>
          <li>
            <button :class="{ active: activeTab == ActiveTab.Messages }" @click="setActiveTab(ActiveTab.Messages)">
              Messages
            </button>
          </li>
          <li>
            <button :class="{ active: activeTab == ActiveTab.Analytics }" @click="setActiveTab(ActiveTab.Analytics)">
              Analytics
            </button>
          </li>
        </ul>
      </div>
      <KeepAlive>
        <AdminUsers v-if="activeTab === ActiveTab.Users" :all-users="users!" @user-deleted="deleteUser" />
      </KeepAlive>

      <KeepAlive>
        <AdminOrders
          v-if="activeTab === ActiveTab.Orders"
          :all-orders="orders!"
          :all-users="users!"
          @order-deleted="deleteOrder"
        />
      </KeepAlive>

      <KeepAlive>
        <OrdersGeRu
          v-if="activeTab === ActiveTab.OrdersGeRu"
          :all-orders="orderGeRu!"
          :all-users="users!"
          @order-deleted="deleteGeRuOrder"
        />
      </KeepAlive>

      <KeepAlive>
        <AdminMessages v-if="activeTab === ActiveTab.Messages" :messages="messages!" @message-deleted="deleteMessage" />
      </KeepAlive>

      <KeepAlive>
        <AdminAnalytics
          v-if="activeTab === ActiveTab.Analytics"
          :allTransactions="transactions!"
          :orders="orders!"
          :users="users!"
        />
      </KeepAlive>
    </div>
    <Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
  </div>
</template>

<style scoped>
.btn.btn-disabled {
  background-color: theme('colors.transparent');
}

button.active,
.btn-active {
  background-color: theme('colors.black') !important;
  color: theme('colors.white') !important;
}
</style>
