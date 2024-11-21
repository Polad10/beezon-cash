<script setup lang="ts">
import Decimal from 'decimal.js'
import type { Order } from '~/models/Order'
import type { Message } from '~/models/Message'
import { OrderStatus, toDisplayString } from '~/models/OrderStatus'
import type { User } from '~/models/User'
import NewUserModal from '~/components/admin/NewUserModal.vue'
import NewOrderModal from '~/components/admin/NewOrderModal.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import axios from 'axios'
import EditUserModal from '~/components/admin/EditUserModal.vue'
import EditOrderModal from '~/components/admin/EditOrderModal.vue'
import NewMessageModal from '~/components/admin/NewMessageModal.vue'
import EditMessageModal from '~/components/admin/EditMessageModal.vue'

enum VisibleTab {
  Users,
  Orders,
  Messages,
}

const rowsPerPage = 15

const users = (await useFetch<User[]>('/api/users')).data
const orders = (await useFetch<Order[]>('/api/orders')).data
const messages = (await useFetch<Message[]>('/api/messages')).data

const newUserModalRef = ref<typeof NewUserModal | null>(null)
const editUserModalRef = ref<typeof EditUserModal | null>(null)
const newOrderModalRef = ref<typeof NewOrderModal | null>(null)
const editOrderModalRef = ref<typeof EditOrderModal | null>(null)
const newMessageModalRef = ref<typeof NewMessageModal | null>(null)
const editMessageModalRef = ref<typeof EditMessageModal | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)
const pageNr = ref(1)
const visibleTab = ref<VisibleTab>(VisibleTab.Users)

onMounted(async () => {
  orders.value?.forEach((order) => {
    processOrderValues(order)
  })

  orders.value?.sort((a, b) => b.date.getTime() - a.date.getTime())
})

const pageUsers = computed(() => {
  return users.value?.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const pageOrders = computed(() => {
  return orders.value?.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const pageMessages = computed(() => {
  return messages.value?.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const maxPageNr = computed(() => {
  let totalRows = 0

  if (visibleTab.value == VisibleTab.Users) {
    totalRows = users.value!.length
  } else if (visibleTab.value == VisibleTab.Orders) {
    totalRows = orders.value!.length
  } else if (visibleTab.value == VisibleTab.Messages) {
    totalRows = messages.value!.length
  }

  return Math.max(Math.ceil(totalRows / rowsPerPage), 1)
})

function setVisibleTab(tab: VisibleTab) {
  pageNr.value = 1
  visibleTab.value = tab
}

function setPageNr(newPageNr: number) {
  pageNr.value = newPageNr
}

function pageNrIsInBetween(pageNr: number) {
  return pageNr > 1 && pageNr < maxPageNr.value
}

function handleUserCreated(user: User) {
  users.value?.push(user)
}

function handleUserEdited(user: User) {
  const localUser = users.value?.find((u) => u.id === user.id)

  if (localUser) {
    Object.assign(localUser, user)
  }
}

async function deleteUser(user: User) {
  await axios.delete(`/api/users/${user.id}`)
  users.value = users.value?.filter((u) => u.id !== user.id)!
}

function handleOrderCreated(order: Order) {
  processOrderValues(order)
  orders.value?.push(order)
}

function handleOrderEdited(order: Order) {
  const localOrder = orders.value?.find((o) => o.id === order.id)

  if (localOrder) {
    processOrderValues(order)
    Object.assign(localOrder, order)
  }
}

async function deleteOrder(order: Order) {
  await axios.delete(`/api/orders/${order.id}`)
  orders.value = orders.value?.filter((o) => o.id !== order.id)!
}

function handleMessageCreated(message: Message) {
  messages.value?.push(message)
}

function handleMessageEdited(message: Message) {
  const localMessage = messages.value?.find((m) => m.id === message.id)

  if (localMessage) {
    Object.assign(localMessage, message)
  }
}

async function deleteMessage(message: Message) {
  await axios.delete(`/api/messages/${message.id}`)
  messages.value = messages.value?.filter((m) => m.id !== message.id)!
}

function processOrderValues(order: Order) {
  order.date = new Date(order.date)
  order.current_price = new Decimal(order.current_price)
  order.original_price = new Decimal(order.original_price)

  if (order.bonus_received) {
    order.bonus_received = new Decimal(order.bonus_received)
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
      <div class="flex flex-col grow">
        <div v-if="visibleTab == VisibleTab.Users" class="flex flex-row h-12 mr-3 justify-between items-center">
          <span class="text-2xl font-bold">Users</span>
          <div class="flex flex-row gap-5">
            <label
              class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
            >
              <input type="text" class="grow" placeholder="Search" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
            <button class="btn btn-sm btn-outline" @click="newUserModalRef?.open()">Add user</button>
          </div>
        </div>
        <div v-if="visibleTab == VisibleTab.Orders" class="flex flex-row h-12 mr-3 justify-between items-center">
          <span class="text-2xl font-bold">Orders</span>
          <div class="flex flex-row gap-5">
            <label
              class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
            >
              <input type="text" class="grow" placeholder="Search" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
            <button class="btn btn-sm btn-outline" @click="newOrderModalRef?.open()">Add order</button>
          </div>
        </div>
        <div v-if="visibleTab == VisibleTab.Messages" class="flex flex-row h-12 mr-3 justify-between items-center">
          <span class="text-2xl font-bold">Messages</span>
          <div class="flex flex-row gap-5">
            <button class="btn btn-sm btn-outline" @click="newMessageModalRef?.open()">Add message</button>
          </div>
        </div>
        <div class="flex flex-col bg-white mr-3 mb-5 grow">
          <table v-if="visibleTab == VisibleTab.Users" class="table table-sm">
            <thead>
              <tr class="bg-base-200">
                <th>ID</th>
                <th>NAME</th>
                <th>PHONE NUMBER</th>
                <th>TG USERNAME</th>
                <th>REFERRAL CODE</th>
                <th>INVITED BY</th>
                <th>BALANCE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in pageUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.phone_nr }}</td>
                <td>{{ user.tg_username }}</td>
                <td>{{ user.referral_code }}</td>
                <td>{{ user.invited_by }}</td>
                <td>{{ user.balance }}</td>
                <td>
                  <div class="flex flex-row gap-2">
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="editUserModalRef?.open(user)"
                    >
                      <ion-icon name="pencil"></ion-icon>
                    </button>
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="confirmDeleteModalRef?.open(() => deleteUser(user))"
                    >
                      <ion-icon name="trash"></ion-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="visibleTab == VisibleTab.Orders" class="table table-sm">
            <thead>
              <tr class="bg-base-200">
                <th>ID</th>
                <th>DATE</th>
                <th>ORIGINAL PRICE</th>
                <th>CURRENT PRICE</th>
                <th>STATUS</th>
                <th>BONUS RECEIVED</th>
                <th>USER ID</th>
                <th>ORDER CODE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in pageOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ toISODate(order.date) }}</td>
                <td>{{ order.original_price }}</td>
                <td>{{ order.current_price }}</td>
                <td>{{ toDisplayString(order.status) }}</td>
                <td>{{ order.bonus_received }}</td>
                <td>{{ order.user_id }}</td>
                <td>{{ order.code }}</td>
                <td>
                  <div class="flex flex-row gap-2">
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="editOrderModalRef?.open(order)"
                    >
                      <ion-icon name="pencil"></ion-icon>
                    </button>
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="confirmDeleteModalRef?.open(() => deleteOrder(order))"
                    >
                      <ion-icon name="trash"></ion-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <table v-if="visibleTab == VisibleTab.Messages" class="table table-sm">
            <thead>
              <tr class="bg-base-200">
                <th>ID</th>
                <th>NAME</th>
                <th>TEXT</th>
                <th>ORDER STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="message in pageMessages" :key="message.id">
                <td>{{ message.id }}</td>
                <td>{{ message.name }}</td>
                <td>{{ message.text }}</td>
                <td>{{ toDisplayString(message.order_status) }}</td>
                <td>
                  <div class="flex flex-row gap-2">
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="editMessageModalRef?.open(message)"
                    >
                      <ion-icon name="pencil"></ion-icon>
                    </button>
                    <button
                      class="btn btn-sm text-gray-500 btn-square btn-outline"
                      @click="confirmDeleteModalRef?.open(() => deleteMessage(message))"
                    >
                      <ion-icon name="trash"></ion-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-auto mb-5 self-center join">
            <button
              class="join-item btn btn-ghost"
              :class="{ 'btn-disabled': pageNr == 1 }"
              @click="setPageNr(pageNr - 1)"
            >
              {{ '«' }}
            </button>
            <button class="join-item btn btn-ghost" :class="{ 'btn-active': pageNr == 1 }" @click="setPageNr(1)">
              1
            </button>
            <button
              v-if="pageNrIsInBetween(pageNr - 2)"
              class="join-item btn btn-ghost btn-disabled disabled: bg-black"
            >
              ...
            </button>
            <button v-if="pageNrIsInBetween(pageNr - 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr - 1)">
              {{ pageNr - 1 }}
            </button>
            <button
              v-if="pageNrIsInBetween(pageNr)"
              class="join-item btn btn-ghost btn-active bg-white"
              @click="setPageNr(pageNr)"
            >
              {{ pageNr }}
            </button>
            <button v-if="pageNrIsInBetween(pageNr + 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr + 1)">
              {{ pageNr + 1 }}
            </button>
            <button v-if="pageNrIsInBetween(pageNr + 2)" class="join-item btn btn-ghost btn-disabled bg-white">
              ...
            </button>
            <button
              v-if="pageNr > 1"
              class="join-item btn btn-ghost"
              @click="setPageNr(maxPageNr)"
              :class="{ 'btn-active': pageNr == maxPageNr }"
            >
              {{ maxPageNr }}
            </button>
            <button
              class="join-item btn btn-ghost"
              :class="{ 'btn-disabled': pageNr == maxPageNr }"
              @click="setPageNr(pageNr + 1)"
            >
              {{ '»' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <AdminNewUserModal ref="newUserModalRef" @user-created="handleUserCreated" />
    <AdminEditUserModal ref="editUserModalRef" @user-edited="handleUserEdited" />
    <AdminNewOrderModal ref="newOrderModalRef" @order-created="handleOrderCreated" />
    <AdminEditOrderModal ref="editOrderModalRef" @order-edited="handleOrderEdited" />
    <AdminNewMessageModal ref="newMessageModalRef" @message-created="handleMessageCreated" />
    <AdminEditMessageModal ref="editMessageModalRef" @message-edited="handleMessageEdited" />
    <AdminConfirmDeleteModal ref="confirmDeleteModalRef" />
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
