<script setup lang="ts">
import { mockTelegramEnv, retrieveLaunchParams } from '@telegram-apps/sdk'

useHead({
  title: 'Test',
  link: [
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css',
    },
  ],
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
    },
    {
      type: 'module',
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
    },
    {
      nomodule: true,
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
    },
  ],
})

onMounted(async () => {
  try {
    mockTelegramEnv({
      themeParams: {
        accentTextColor: '#6ab2f2',
        bgColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        destructiveTextColor: '#ec3942',
        headerBgColor: '#17212b',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBgColor: '#232e3c',
        sectionBgColor: '#17212b',
        sectionHeaderTextColor: '#6ab3f3',
        subtitleTextColor: '#708499',
        textColor: '#f5f5f5',
      },
      initData: {
        user: {
          id: 99281932,
          firstName: 'Andrew',
          lastName: 'Rogue',
          username: 'rogue',
          languageCode: 'en',
          isPremium: true,
          allowsWriteToPm: true,
        },
        hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
        authDate: new Date(1716922846000),
        startParam: 'debug',
        chatType: 'sender',
        chatInstance: '8428209589180549439',
      },
      initDataRaw: new URLSearchParams([
        [
          'user',
          JSON.stringify({
            id: 99281932,
            first_name: 'Andrew',
            last_name: 'Rogue',
            username: 'rogue',
            language_code: 'en',
            is_premium: true,
            allows_write_to_pm: true,
          }),
        ],
        ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
        ['auth_date', Date.now().toString()],
        ['start_param', 'debug'],
        ['chat_type', 'sender'],
        ['chat_instance', '8428209589180549439'],
      ]).toString(),
      version: '7.2',
      platform: 'tdesktop',
    })

    const { initDataRaw } = retrieveLaunchParams()

    const apiUrl = 'http://10.0.0.199:3001/api'
    const headers = {
      headers: { Authorization: `tma ${initDataRaw}` },
    }

    const me = (await axios.get<User>(`${apiUrl}/me`, headers)).data
    const ordersData = (await axios.get<Order[]>(`${apiUrl}/orders`, headers)).data

    ordersData.forEach((order) => (order.date = new Date(order.date)))
    ordersData.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })

    user.value = me
    orders.value = ordersData
  } catch (ex) {
    console.log(ex)
  }
})

import { ref } from 'vue'
import axios from 'axios'
import type { User } from './models/User'
import type { Order } from './models/Order'

const copyToastVisible = ref(false)
const bonusBalanceExceededToastVisible = ref(false)
const user = ref<User | null>(null)
const orders = ref<Order[]>([])

function showBonusBalanceExceededToast() {
  showToast(bonusBalanceExceededToastVisible)
}

async function copyReferralCode() {
  await navigator.clipboard.writeText(user.value!.referral_code)
  showToast(copyToastVisible)
}

function showToast(toastVisible: Ref<boolean>) {
  toastVisible.value = true

  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

function balanceIsSufficient(bonus: number) {
  if (bonus <= user.value!.balance) {
    return true
  }

  showBonusBalanceExceededToast()
  return false
}

function applyBonus(bonus: number) {
  user.value!.balance -= bonus
}
</script>

<template>
  <div>
    <div v-if="user">
      <div class="flex justify-center py-4">
        <p class="text-3xl">Beezon Cash</p>
      </div>
      <div role="tablist" class="tabs tabs-bordered grid-cols-3">
        <input type="radio" name="tab" role="tab" class="tab" aria-label="Баланс" checked />
        <div role="tabpanel" class="tab-content p-5">
          <div class="flex justify-center">
            <div class="relative">
              <img src="./public/balance-card.svg" class="rounded-3xl" />
              <div class="absolute top-1/2 w-full px-5">
                <div class="flex flex-col">
                  <div class="flex flex-row justify-between">
                    <div>
                      <p class="leading-none text-sm">Владелец карты</p>
                      <p class="font-bold">{{ user.first_name }} {{ user.last_name }}</p>
                    </div>
                    <div>
                      <p class="leading-none text-sm">Бонусы</p>
                      <p class="font-bold">{{ user.balance }} ₾</p>
                    </div>
                  </div>
                  <div class="flex flex-row mt-3">
                    <div>
                      <p class="leading-none text-sm">Номер телефона</p>
                      <p class="font-bold">{{ user.phone_nr }}</p>
                    </div>
                  </div>
                  <div class="flex flex-row mt-3">
                    <div>
                      <p class="leading-none text-sm">Telegram</p>
                      <p class="font-bold">@{{ user.tg_username }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input type="radio" name="tab" role="tab" class="tab" aria-label="Заказы" />
        <div role="tabpanel" class="tab-content p-5">
          <OrderItem
            v-for="order in orders"
            :key="order.id"
            :order="order"
            :balance-is-sufficient="balanceIsSufficient"
            :apply-bonus="applyBonus"
          />
        </div>
        <input type="radio" name="tab" role="tab" class="tab" aria-label="Поделись" />
        <div role="tabpanel" class="tab-content p-5">
          <div class="flex flex-col items-center">
            <p class="text-2xl text-center">Ваш промокод</p>
            <button class="btn btn-wide text-xl mt-2 px-5" @click="copyReferralCode">
              <div class="mx-auto">{{ user.referral_code }}</div>
              <ion-icon name="copy-outline"></ion-icon>
            </button>
          </div>
          <div class="flex justify-center">
            <ul class="steps steps-vertical mt-5 gap-3">
              <li class="step">
                <div>
                  <p class="font-semibold text-sm text-left">Отправляете промокод</p>
                  <p class="font-thin text-sm text-left">
                    Скопируйте свой промокод и отправьте его другу любым удобным способом
                  </p>
                </div>
              </li>
              <li class="step">
                <div>
                  <p class="font-semibold text-sm text-left">Друг регистрируется</p>
                  <p class="font-thin text-sm text-left">
                    Вводит ваш промокод при заполнении формы приема заказа и получает свой заказ в Грузии
                  </p>
                </div>
              </li>
              <li class="step" data-content="🎉">
                <div>
                  <p class="font-semibold text-sm text-left">Получаете бонусы</p>
                  <p class="font-thin text-sm text-left">
                    Вам на баланс вернется 5% от стоимости первого заказа вашего друга
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="copyToastVisible" class="toast toast-center">
        <div class="alert alert-success">
          <span>Скопировано</span>
        </div>
      </div>
      <div v-if="bonusBalanceExceededToastVisible" class="toast toast-top whitespace-normal">
        <div class="alert alert-warning">
          <span>Вы списываете больше бонусов, чем есть на балансе</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-3xl">User not found</p>
    </div>
  </div>
</template>

<style scoped>
.tab:is(.tab-active, [aria-selected='true']):not(.tab-disabled):not([disabled]),
.tab:is(input:checked) {
  color: #93c5fd;
  border-color: #93c5fd;
}
</style>
