<script setup lang="ts">
import type { Order } from '~/models/Order'
import type { Message } from '~/models/Message'
import type { User } from '~/models/User'
import axios from 'axios'

enum VisibleTab {
  Users,
  Orders,
  Messages,
}

const allUsers = (await useFetch<User[]>('/api/users')).data
const allOrders = (await useFetch<Order[]>('/api/orders')).data
const messages = (await useFetch<Message[]>('/api/messages')).data

const visibleTab = ref<VisibleTab>(VisibleTab.Users)
const showErrorToast = ref(false)
const errorMessage = ref('')

function setVisibleTab(tab: VisibleTab) {
  visibleTab.value = tab
}

async function deleteUser(user: User) {
  try {
    await axios.delete(`/api/users/${user.id}`)
    allUsers.value = allUsers.value!.filter((u) => u.id !== user.id)
    allOrders.value = allOrders.value!.filter((o) => o.user_id !== user.id)
  } catch (ex) {
    errorMessage.value = 'Something went wrong. Please try again later.'
    showToast(showErrorToast)
  }
}

async function deleteOrder(order: Order) {
  try {
    await axios.delete(`/api/orders/${order.id}`)
    allOrders.value = allOrders.value?.filter((o) => o.id !== order.id)!
  } catch (ex) {
    errorMessage.value = 'Something went wrong. Please try again later.'
    showToast(showErrorToast)
  }
}

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
      <div class="flex flex-col w-32">
        <div class="h-12"></div>
        <ul class="menu w-32 rounded-box py-0">
          <li>
            <button :class="{ active: visibleTab == VisibleTab.Users }" @click="setVisibleTab(VisibleTab.Users)">
              Users
            </button>
          </li>
          <li>
            <button :class="{ active: visibleTab == VisibleTab.Orders }" @click="setVisibleTab(VisibleTab.Orders)">
              Orders
            </button>
          </li>
          <li>
            <button :class="{ active: visibleTab == VisibleTab.Messages }" @click="setVisibleTab(VisibleTab.Messages)">
              Messages
            </button>
          </li>
        </ul>
      </div>
      <AdminUsers v-if="visibleTab === VisibleTab.Users" :all-users="allUsers!" @user-deleted="deleteUser" />
      <AdminOrders
        v-if="visibleTab === VisibleTab.Orders"
        :all-orders="allOrders!"
        :all-users="allUsers!"
        @order-deleted="deleteOrder"
      />
      <AdminMessages v-if="visibleTab === VisibleTab.Messages" :messages="messages!" @message-deleted="deleteMessage" />
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
