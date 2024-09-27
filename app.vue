<script setup lang="ts">
import { retrieveLaunchParams, type InitDataParsed } from '@telegram-apps/sdk'

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

// let initDataRaw: InitDataParsed | undefined = undefined

// if (process.client) {
//   const launchParams = retrieveLaunchParams()
//   initDataRaw = launchParams.initData
// }

import { ref } from 'vue'
import { OrderStatus } from './server/utils/OrderStatus'

const copyToastVisible = ref(false)
const bonusBalanceExceededToastVisible = ref(false)

let balance = 50

function showBonusBalanceExceededToast() {
  showToast(bonusBalanceExceededToastVisible)
}

function showCopyToast() {
  showToast(copyToastVisible)
}

function showToast(toastVisible: Ref<boolean>) {
  toastVisible.value = true

  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

function balanceIsSufficient(bonus: number) {
  if (bonus <= balance) {
    return true
  }

  showBonusBalanceExceededToast()
  return false
}

function applyBonus(bonus: number) {
  balance -= bonus
}
</script>

<template>
  <div>
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
                    <p class="font-bold">Николаенко Ольга</p>
                  </div>
                  <div>
                    <p class="leading-none text-sm">Бонусы</p>
                    <p class="font-bold">12 ₾</p>
                  </div>
                </div>
                <div class="flex flex-row mt-3">
                  <div>
                    <p class="leading-none text-sm">Номер телефона</p>
                    <p class="font-bold">+123456789</p>
                  </div>
                </div>
                <div class="flex flex-row mt-3">
                  <div>
                    <p class="leading-none text-sm">Telegram</p>
                    <p class="font-bold">@username</p>
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
          :bonusApplied="false"
          :bonusReceived="1.62"
          :originalPrice="54"
          :currentPrice="54"
          :order-status="OrderStatus.Delivered"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
        <OrderItem
          :bonusApplied="true"
          :originalPrice="54"
          :currentPrice="43"
          :order-status="OrderStatus.Delivered"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
        <OrderItem
          :bonusApplied="false"
          :originalPrice="54"
          :currentPrice="54"
          :order-status="OrderStatus.WaitingForPayment"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
        <OrderItem
          :bonusApplied="false"
          :originalPrice="0"
          :currentPrice="0"
          :order-status="OrderStatus.ArrivedInDestinationCountry"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
        <OrderItem
          :bonusApplied="false"
          :originalPrice="0"
          :currentPrice="0"
          :order-status="OrderStatus.OnTheWay"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
        <OrderItem
          :bonusApplied="false"
          :originalPrice="0"
          :currentPrice="0"
          :order-status="OrderStatus.New"
          :balance-is-sufficient="balanceIsSufficient"
          :apply-bonus="applyBonus"
        />
      </div>
      <input type="radio" name="tab" role="tab" class="tab" aria-label="Поделись" />
      <div role="tabpanel" class="tab-content p-5">
        <div class="flex flex-col items-center">
          <p class="text-2xl text-center">Ваш промокод</p>
          <button class="btn btn-wide text-xl mt-2 px-5" @click="showCopyToast">
            <div class="mx-auto">RFID76564434</div>
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
</template>
