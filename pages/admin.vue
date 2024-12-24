<script setup lang="ts">
import Decimal from 'decimal.js'
import type { Order, OrderPatchRequest } from '~/models/Order'
import type { Message } from '~/models/Message'
import {
  OrderStatus,
  toAdminDisplayString as orderStatusToDisplayString,
  toAdminDisplayString,
  toColorCode,
  toTextColorCode,
} from '~/models/OrderStatus'
import { toDisplayString as cityToDisplayString } from '~/models/City'
import type { User } from '~/models/User'
import NewUserModal from '~/components/admin/NewUserModal.vue'
import NewOrderModal from '~/components/admin/NewOrderModal.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import axios from 'axios'
import EditUserModal from '~/components/admin/EditUserModal.vue'
import EditOrderModal from '~/components/admin/EditOrderModal.vue'
import NewMessageModal from '~/components/admin/NewMessageModal.vue'
import EditMessageModal from '~/components/admin/EditMessageModal.vue'
import Fuse from 'fuse.js'

enum VisibleTab {
  Users,
  Orders,
  Messages,
}

const rowsPerPage = 30

const allUsers = (await useFetch<User[]>('/api/users')).data
const allOrders = (await useFetch<Order[]>('/api/orders')).data
const messages = (await useFetch<Message[]>('/api/messages')).data

const userSearch = ref('')
const orderSearch = ref('')
const orderStatusFilter = ref<Set<OrderStatus>>(new Set<OrderStatus>())
const currentPageNr = ref(1)
const visibleTab = ref<VisibleTab>(VisibleTab.Users)
const sendNotification = ref(true)
const showErrorToast = ref(false)
const errorMessage = ref('')

const newUserModalRef = ref<typeof NewUserModal | null>(null)
const editUserModalRef = ref<typeof EditUserModal | null>(null)
const newOrderModalRef = ref<typeof NewOrderModal | null>(null)
const editOrderModalRef = ref<typeof EditOrderModal | null>(null)
const newMessageModalRef = ref<typeof NewMessageModal | null>(null)
const editMessageModalRef = ref<typeof EditMessageModal | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)

const fuseUsersOptions = {
  keys: ['tg_username', 'last_name', 'first_name', 'phone_nr'],
}

const fuseOrdersOptions = {
  keys: ['user.tg_username', 'user.last_name', 'user.first_name', 'code', 'description', 'order_tracks.track_number'],
}

let fuseUsers = computed(() => {
  return new Fuse(allUsers.value!, fuseUsersOptions)
})

let fuseOrders = computed(() => {
  return new Fuse(allOrders.value!, fuseOrdersOptions)
})

onMounted(async () => {
  allOrders.value?.forEach((order) => {
    processOrderValues(order)
  })
})

const users = computed(() => {
  if (!userSearch.value) {
    return [...allUsers.value!]
  }

  return fuseUsers.value.search(userSearch.value).map((result) => result.item)
})

const orders = computed(() => {
  let result = []

  // search
  if (!orderSearch.value) {
    sortOrders()
    result = [...allOrders.value!]
  } else {
    result = fuseOrders.value.search(orderSearch.value).map((result) => result.item)
  }

  // filter by order status
  if (orderStatusFilter.value.size > 0) {
    result = result.filter((order) => orderStatusFilter.value.has(order.status))
  }

  return result
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

const pageNr = computed(() => {
  currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
  return currentPageNr.value
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
  reset()
  visibleTab.value = tab
}

function setPageNr(newPageNr: number) {
  currentPageNr.value = newPageNr
}

function pageNrIsInBetween(pageNr: number) {
  return pageNr > 1 && pageNr < maxPageNr.value
}

function handleUserCreated(user: User) {
  allUsers.value?.push(user)
}

function handleUserEdited(user: User) {
  const localUser = allUsers.value?.find((u) => u.id === user.id)

  if (localUser) {
    Object.assign(localUser, user)
  }
}

async function deleteUser(user: User) {
  await axios.delete(`/api/users/${user.id}`)
  allUsers.value = allUsers.value!.filter((u) => u.id !== user.id)
  allOrders.value = allOrders.value!.filter((o) => o.user_id !== user.id)
}

function handleOrderCreated(order: Order) {
  processOrderValues(order)
  allOrders.value?.push(order)
}

function handleOrderEdited(order: Order) {
  const localOrder = allOrders.value?.find((o) => o.id === order.id)

  if (localOrder) {
    processOrderValues(order)
    Object.assign(localOrder, order)
  }
}

async function deleteOrder(order: Order) {
  await axios.delete(`/api/orders/${order.id}`)
  allOrders.value = allOrders.value?.filter((o) => o.id !== order.id)!
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
  order.bonus_received = new Decimal(order.bonus_received)
  order.weight = new Decimal(order.weight)
  order.additional_cost = new Decimal(order.additional_cost)
  order.partner_cost = new Decimal(order.partner_cost)
  order.user = users.value?.find((u) => u.id === order.user_id)
}

function reset() {
  currentPageNr.value = 1
  userSearch.value = ''
  orderSearch.value = ''
  orderStatusFilter.value = new Set<OrderStatus>()
  sendNotification.value = true
  showErrorToast.value = false
  errorMessage.value = ''
}

function sortOrders() {
  allOrders.value?.sort((a, b) => b.code - a.code)
}

function exportToCSV() {
  const bom = '\uFEFF'
  const headers = ['Номер заказа', 'Фамилия', 'Имя', 'Вес без округления', 'Начальная сумма', 'Конечная сумма']
  const rows: string[] = []

  for (const order of orders.value) {
    const row = [
      order.code,
      order.user?.last_name,
      order.user?.first_name,
      order.weight,
      order.original_price,
      order.current_price,
    ].join(',')
    rows.push(row)
  }

  const data = [headers, rows.join('\n')].join('\n')
  const blob = new Blob([bom + data], { type: 'text/csv' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'orders.csv'

  a.click()
}

async function updateOrderStage(order: Order, newOrderStatus: OrderStatus) {
  try {
    const request: OrderPatchRequest = { status: newOrderStatus, send_notification: sendNotification.value }
    const updatedOrder = (await axios.patch(`/api/orders/${order.id}`, request)).data
    order.status = updatedOrder.status
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
      <div class="flex flex-col grow">
        <div v-if="visibleTab == VisibleTab.Users" class="flex flex-row min-h-12 mr-3 justify-between items-center">
          <span class="text-2xl font-bold">Users</span>
          <div class="flex flex-row gap-5">
            <label
              class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
            >
              <input type="text" class="grow" placeholder="Search" v-model="userSearch" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
            <button class="btn btn-sm btn-outline" @click="newUserModalRef?.open()">Add user</button>
          </div>
        </div>
        <div v-if="visibleTab == VisibleTab.Orders" class="flex flex-row min-h-12 mr-3 justify-between items-center">
          <span class="text-2xl font-bold">Orders</span>
          <div class="flex flex-row gap-5">
            <label class="label cursor-pointer gap-2 p-0">
              <input type="checkbox" class="checkbox checkbox-sm" v-model="sendNotification" />
              <span class="label-text">Send notification</span>
            </label>
            <button class="btn btn-sm" @click="exportToCSV">
              Export CSV
              <ion-icon name="download-outline" class="text-base"></ion-icon>
            </button>
            <details class="dropdown dropdown-end">
              <summary class="btn btn-sm mb-1">
                {{ orderStatusFilter.size > 0 ? `Selected ${orderStatusFilter.size}` : 'All stages' }}
                <ion-icon name="filter-outline" class="text-base"></ion-icon>
              </summary>
              <ul class="menu dropdown-content rounded-box z-[1] p-2 shadow w-52 bg-white">
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.New) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.New"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.WarehouseRF) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.WarehouseRF"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.Courier1) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.Courier1"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.Courier2) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.Courier2"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.ProcessedInTbilisi) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.ProcessedInTbilisi"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.ReadyForDeliveryInTbilisi) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.ReadyForDeliveryInTbilisi"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.WarehouseTbilisi) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.WarehouseTbilisi"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.ReadyForDeliveryByPony) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.ReadyForDeliveryByPony"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.WaitingForDeliveryByPony) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.WaitingForDeliveryByPony"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
                <li>
                  <label class="label cursor-pointer">
                    <span class="label-text">{{ toAdminDisplayString(OrderStatus.Delivered) }}</span>
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      :value="OrderStatus.Delivered"
                      v-model="orderStatusFilter"
                    />
                  </label>
                </li>
              </ul>
            </details>
            <label
              class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
            >
              <input type="text" class="grow" placeholder="Search" v-model="orderSearch" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
            <button class="btn btn-sm btn-outline" @click="newOrderModalRef?.open()">Add order</button>
          </div>
        </div>
        <div v-if="visibleTab == VisibleTab.Messages" class="flex flex-row min-h-12 mr-3 justify-between items-center">
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
                <th>TELEGRAM</th>
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
                <th>ORDER CODE</th>
                <th>STATUS</th>
                <th>USER</th>
                <th>TELEGRAM</th>
                <th>WEIGHT</th>
                <th>ORIGINAL PRICE</th>
                <th>CURRENT PRICE</th>
                <th>CITY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in pageOrders" :key="order.id">
                <td>{{ order.code }}</td>
                <td>
                  <AdminStatusDropdown
                    :model-value="order.status"
                    class="select-sm"
                    :class="[
                      `bg-[${toColorCode(order.status)}]`,
                      `text-[${toTextColorCode(order.status)}]`,
                      'focus:bg-white',
                      'focus:text-black',
                    ]"
                    form-control-class="w-fit"
                    @update:model-value="(val: OrderStatus) => updateOrderStage(order, val)"
                  />
                </td>
                <td>{{ order.user?.first_name }} {{ order.user?.last_name }}</td>
                <td>{{ order.user?.tg_username }}</td>
                <td>{{ order.weight }}</td>
                <td>{{ order.original_price }}</td>
                <td>{{ order.current_price }}</td>
                <td>{{ cityToDisplayString(order.city) }}</td>
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
                <td>{{ orderStatusToDisplayString(message.order_status) }}</td>
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
    <AdminNewOrderModal ref="newOrderModalRef" @order-created="handleOrderCreated" :users="allUsers || []" />
    <AdminEditOrderModal ref="editOrderModalRef" @order-edited="handleOrderEdited" :users="allUsers || []" />
    <AdminNewMessageModal ref="newMessageModalRef" @message-created="handleMessageCreated" />
    <AdminEditMessageModal ref="editMessageModalRef" @message-edited="handleMessageEdited" />
    <AdminConfirmDeleteModal ref="confirmDeleteModalRef" />
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
