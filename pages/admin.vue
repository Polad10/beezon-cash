<script setup lang="ts">
import Decimal from 'decimal.js'
import type { Order } from '~/models/Order'
import { OrderStatus } from '~/models/OrderStatus'
import type { User } from '~/models/User'

enum VisibleTab {
  Users,
  Orders,
  Messages,
  Integration,
}

const apiUrl = 'http://localhost:3001/admin/api'

const users = (await useFetch<User[]>(`${apiUrl}/users`)).data
const orders = (await useFetch<Order[]>(`${apiUrl}/orders`)).data

onMounted(async () => {
  orders.value?.forEach((order) => {
    order.date = new Date(order.date)
    order.current_price = new Decimal(order.current_price)
    order.original_price = new Decimal(order.original_price)

    if (order.bonus_received) {
      order.bonus_received = new Decimal(order.bonus_received)
    }
  })

  orders.value?.sort((a, b) => b.date.getTime() - a.date.getTime())
})

const visibleTab = ref<VisibleTab>(VisibleTab.Users)

function setVisibleTab(tab: VisibleTab) {
  visibleTab.value = tab
}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="navbar">
      <p class="text-2xl font-bold">BEEZON CASH</p>
    </div>
    <div class="flex flex-row my-3 pr-3 bg-zinc-100 grow overflow-auto">
      <div class="flex flex-col w-32">
        <div class="h-12"></div>
        <ul class="menu w-32 rounded-box py-0">
          <li>
            <button :class="{ focus: visibleTab == VisibleTab.Users }" @click="setVisibleTab(VisibleTab.Users)">
              Users
            </button>
          </li>
          <li><button @click="setVisibleTab(VisibleTab.Orders)">Orders</button></li>
          <li @click="setVisibleTab(VisibleTab.Messages)"><button>Messages</button></li>
          <li @click="setVisibleTab(VisibleTab.Integration)"><button>Integration</button></li>
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
            <button class="btn btn-sm btn-outline">Add user</button>
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
            <button class="btn btn-sm btn-outline">Add order</button>
          </div>
        </div>
        <div class="bg-white mr-3 mb-5 grow">
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
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.phone_nr }}</td>
                <td>{{ user.tg_username }}</td>
                <td>{{ user.referral_code }}</td>
                <td>{{ user.invited_by }}</td>
                <td>{{ user.balance }}</td>
                <td>
                  <div class="flex flex-row gap-2">
                    <button class="btn btn-sm text-gray-500 btn-square btn-outline">
                      <ion-icon name="pencil"></ion-icon>
                    </button>
                    <button class="btn btn-sm text-gray-500 btn-square btn-outline">
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
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.date.toLocaleDateString() }}</td>
                <td>{{ order.original_price }}</td>
                <td>{{ order.current_price }}</td>
                <td>{{ order.status }}</td>
                <td>{{ order.bonus_received }}</td>
                <td>{{ order.user_id }}</td>
                <td>{{ order.code }}</td>
                <td>
                  <div class="flex flex-row gap-2">
                    <button class="btn btn-sm text-gray-500 btn-square btn-outline">
                      <ion-icon name="pencil"></ion-icon>
                    </button>
                    <button class="btn btn-sm text-gray-500 btn-square btn-outline">
                      <ion-icon name="trash"></ion-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
