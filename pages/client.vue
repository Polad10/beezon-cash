<script setup lang="ts">
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { ref } from 'vue'
import axios, { HttpStatusCode } from 'axios'
import type { User } from '~/models/User'
import type { Order } from '~/models/Order'
import Decimal from 'decimal.js'

enum Tab {
  Home,
  Orders,
  Promo,
}

let headers = {}

const activeTab = ref<Tab>(Tab.Home)
const initDataRaw = ref<string | undefined>(undefined)
const copyToastVisible = ref(false)
const bonusBalanceExceededToastVisible = ref(false)
const maxDiscountAmountExceededToastVisible = ref(false)
const bonusIsZeroToastVisible = ref(false)
const errorToastVisible = ref(false)
const loading = ref(true)
const loadingError = ref(false)

const user = ref<User | null>(null)
const orders = ref<Order[]>([])

onMounted(async () => {
  loading.value = true

  try {
    //mockTgEnv()
    initDataRaw.value = retrieveLaunchParams().initDataRaw

    headers = {
      headers: { Authorization: `tma ${initDataRaw.value}` },
    }

    await retrieveMe()
  } catch (err) {
    loadingError.value = true
  } finally {
    loading.value = false
  }
})

async function retrieveMe() {
  try {
    const me = (await axios.get<User | null>('/api/me', headers)).data

    if (me) {
      const ordersData = (await axios.get<Order[]>('/api/me/orders', headers)).data
      me.balance = new Decimal(me.balance)

      ordersData.forEach((order) => {
        order.date = new Date(order.date)
        order.current_price = new Decimal(order.current_price)
        order.original_price = new Decimal(order.original_price)

        if (order.bonus_received) {
          order.bonus_received = new Decimal(order.bonus_received)
        }
      })

      ordersData.sort((a, b) => b.code - a.code)

      user.value = me
      orders.value = ordersData
    }
  } catch (err) {
    const statusCode = getErrorResponseStatusCode(err)

    if (statusCode == HttpStatusCode.NotFound) {
      // user is just not found
      return
    }

    throw err
  }
}

function showBonusBalanceExceededToast() {
  showToast(bonusBalanceExceededToastVisible)
}

function showMaxDiscountAmountExceededToast() {
  showToast(maxDiscountAmountExceededToastVisible)
}

function showBonusIsZeroToast() {
  showToast(bonusIsZeroToastVisible)
}

function showErrorToast() {
  showToast(errorToastVisible)
}

async function copyReferralCode() {
  await navigator.clipboard.writeText(user.value!.referral_code)
  showToast(copyToastVisible)
}

async function applyBonus(orderId: string, bonus: Decimal) {
  try {
    if (!bonus.greaterThan(0)) {
      showBonusIsZeroToast()
      return false
    }

    if (bonus.greaterThan(user.value!.balance)) {
      showBonusBalanceExceededToast()
      return false
    }

    const order = orders.value.find((o) => o.id === orderId)

    if (!order) {
      return false
    }

    const maxDiscountAmount = order.current_price.dividedBy(4)

    if (bonus.greaterThan(maxDiscountAmount)) {
      showMaxDiscountAmountExceededToast()
      return false
    }

    const result = (
      await axios.post<{ user: User; order: Order }>(`api/me/orders/${orderId}/bonus`, { amount: bonus }, headers)
    ).data

    user.value!.balance = new Decimal(result.user.balance)
    order.current_price = new Decimal(result.order.current_price)

    return true
  } catch (err) {
    showErrorToast()
    return false
  }
}

async function handleUserSignedUp() {
  loading.value = true

  try {
    await retrieveMe()
  } catch (err) {
    loadingError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-full">
    <div v-if="loadingError" class="h-full flex flex-col justify-center items-center">
      <p class="text-2xl p-2">Что-то пошло не так. Пожалуйста, попробуйте чуть позже.</p>
    </div>
    <div v-else-if="loading" class="h-full flex flex-col justify-center items-center">
      <span class="loading loading-spinner text-accent"></span>
    </div>
    <Signup v-else-if="!user" :init-data-raw="initDataRaw!" @user-signed-up="handleUserSignedUp" />
    <div v-else>
      <div class="text-black">
        <div class="bg-white min-h-screen">
          <div role="tablist" class="tabs tabs-bordered grid-cols-3 pt-2 min-h-screen content-start">
            <a
              role="tab"
              class="tab text-lg font-light content-end leading-tight pb-1.5 text-black h-16"
              :class="{ 'tab-active': activeTab == Tab.Home }"
              @click="activeTab = Tab.Home"
            >
              <div class="flex flex-col items-center gap-2">
                <ion-icon name="home-outline" class="text-2xl"></ion-icon>
                Главная
              </div>
            </a>
            <div role="tabpanel" class="tab-content pt-7 px-5 min-h-screen">
              <div id="profile-card" class="flex flex-col justify-between h-64 bg-blue-700 rounded-2xl p-6 text-white">
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <p>Ваш бонусный баланс</p>
                    <p class="text-3xl font-semibold">₾ {{ user.balance }}</p>
                  </div>
                  <img src="~public/georgia-flag.svg" width="60" />
                </div>
                <div class="flex flex-row mt-7 text-center text-sm justify-between px-6">
                  <div class="flex flex-col w-12 items-center gap-2">
                    <button class="btn btn-circle text-2xl">
                      <ion-icon name="add-outline"></ion-icon>
                    </button>
                    <p>Оформить заказ</p>
                  </div>
                  <div class="flex flex-col w-12 items-center gap-2">
                    <button class="btn btn-circle text-2xl">
                      <ion-icon name="paper-plane-outline"></ion-icon>
                    </button>
                    <p>Написать менеджеру</p>
                  </div>
                  <div class="flex flex-col w-12 items-center gap-2">
                    <button class="btn btn-circle text-2xl">
                      <ion-icon name="storefront-outline"></ion-icon>
                    </button>
                    <p>Открыть Beezmarket</p>
                  </div>
                </div>
              </div>
            </div>
            <a
              role="tab"
              class="tab text-lg font-light content-end leading-tight pb-1.5 text-black"
              :class="{ 'tab-active': activeTab == Tab.Orders }"
              @click="activeTab = Tab.Orders"
            >
              <div class="flex flex-col items-center gap-2">
                <ion-icon name="heart-outline" class="text-2xl"></ion-icon>
                Заказы
              </div></a
            >
            <div role="tabpanel" class="tab-content p-5 min-h-screen">
              <OrderItem v-for="order in orders" :key="order.id" :order="order" :apply-bonus="applyBonus" />
            </div>
            <a
              role="tab"
              class="tab text-lg font-light content-end leading-tight pb-1.5 text-black"
              :class="{ 'tab-active': activeTab == Tab.Promo }"
              @click="activeTab = Tab.Promo"
            >
              <div class="flex flex-col items-center gap-2">
                <ion-icon name="ticket-outline" class="text-2xl"></ion-icon>
                Промокод
              </div></a
            >
            <div role="tabpanel" class="tab-content p-5 min-h-screen">
              <div class="flex flex-col items-center">
                <p class="text-xl font-regular text-center">Ваш промокод</p>
                <button
                  class="btn btn-wide bg-accent text-xl mt-2 px-5 rounded-2xl hover:bg-accent-content"
                  @click="copyReferralCode"
                >
                  <div class="mx-auto text-white">{{ user.referral_code }}</div>
                  <ion-icon name="copy-outline" class="text-white z-10"></ion-icon>
                </button>
              </div>
              <div class="flex justify-center">
                <ul class="steps steps-vertical mt-5 gap-3">
                  <li class="step step-secondary">
                    <div>
                      <p class="font-semibold text-lg text-left">Отправляете промокод</p>
                      <p class="font-thin text-base text-left leading-none">
                        Скопируйте свой промокод и отправьте его другу любым удобным способом
                      </p>
                    </div>
                  </li>
                  <li class="step step-secondary">
                    <div>
                      <p class="font-semibold text-lg text-left">Друг регистрируется</p>
                      <p class="font-thin text-base text-left leading-none">
                        Вводит ваш промокод при заполнении формы приема заказа и получает свой заказ в Грузии
                      </p>
                    </div>
                  </li>
                  <li class="step step-secondary" data-content="🎉">
                    <div>
                      <p class="font-semibold text-lg text-left">Получаете бонусы</p>
                      <p class="font-thin text-base text-left leading-none">
                        Начисляем <span class="font-medium">10 лари</span> на баланс за первый завершенный заказ вашего
                        друга
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="copyToastVisible" class="toast toast-center">
            <div class="alert bg-secondary text-sm font-bold p-2 flex items-center gap-y-0.5 object-center">
              <span>Скопировано</span>
            </div>
          </div>
          <div
            v-if="bonusBalanceExceededToastVisible"
            class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full"
          >
            <div
              class="alert bg-orange-100 text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-orange-200 object-center"
            >
              <ion-icon name="alert-circle-outline" class="text-warning text-5xl ml-px"></ion-icon>
              <span>Вы списываете больше бонусов, чем есть на балансе</span>
            </div>
          </div>
          <div
            v-if="maxDiscountAmountExceededToastVisible"
            class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full"
          >
            <div
              class="alert bg-orange-100 text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-orange-200 object-center"
            >
              <ion-icon name="alert-circle-outline" class="text-warning text-5xl ml-px"></ion-icon>
              <span>Можно списать не более 25% от суммы заказа</span>
            </div>
          </div>
          <div
            v-if="bonusIsZeroToastVisible"
            class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full"
          >
            <div
              class="alert bg-orange-100 text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-orange-200 object-center"
            >
              <ion-icon name="alert-circle-outline" class="text-warning text-5xl ml-px"></ion-icon>
              <span>Сумма должна быть > 0</span>
            </div>
          </div>
          <div v-if="errorToastVisible" class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full">
            <div
              class="alert alert-info text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
            >
              <ion-icon name="close-circle-outline" class="text-error text-5xl ml-px"></ion-icon>
              <span>Что-то пошло не так. Пожалуйста, попробуйте чуть позже.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab:is(.tab-active, [aria-selected='true']):not(.tab-disabled):not([disabled]),
.tab:is(input:checked) {
  color: theme('colors.accent');
  border-color: theme('colors.accent');
  font-weight: 600;
}

#profile-card {
  background-color: #5e7de3;
  background-image: linear-gradient(160deg, #819bff 0%, #214ad0 80%);
}
</style>
