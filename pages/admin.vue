<script setup lang="ts">
import axios from 'axios'
import { OrderStatus } from '~/models/OrderStatus'
import type { User } from '~/models/User'

enum VisibleTab {
  Users,
  Orders,
  Messages,
  Integration,
}

const apiUrl = 'http://localhost:3001/admin/api'

const initialUsers = (await useFetch(`${apiUrl}/users`)).data
console.log(initialUsers)
const visibleTab = ref<VisibleTab>(VisibleTab.Users)
const users = ref(initialUsers)

function setVisibleTab(tab: VisibleTab) {
  visibleTab.value = tab
}
</script>

<template>
  <div>
    <div class="navbar">
      <p class="text-2xl font-bold">BEEZON CASH</p>
    </div>
    <div class="flex flex-col bg-zinc-100">
      <div class="flex flex-row my-3 pr-3">
        <div class="w-32"></div>
        <div v-if="visibleTab == VisibleTab.Users" class="flex flex-row justify-between grow">
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
        <div v-if="visibleTab == VisibleTab.Orders" class="flex flex-row justify-between grow">
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
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col w-32">
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
        <div class="overflow-x-auto grow">
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
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>2024-10-08</td>
                <td>54.00</td>
                <td>43.00</td>
                <td>{{ OrderStatus.Delivered }}</td>
                <td>1.62</td>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>666666</td>
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
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>2024-10-08</td>
                <td>54.00</td>
                <td>43.00</td>
                <td>{{ OrderStatus.Delivered }}</td>
                <td>1.62</td>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>666666</td>
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
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>2024-10-08</td>
                <td>54.00</td>
                <td>43.00</td>
                <td>{{ OrderStatus.Delivered }}</td>
                <td>1.62</td>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>666666</td>
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
              <tr>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>2024-10-08</td>
                <td>54.00</td>
                <td>43.00</td>
                <td>{{ OrderStatus.Delivered }}</td>
                <td>1.62</td>
                <td>753d40af-1683-48d5-88d6-c221e31708f6</td>
                <td>666666</td>
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
