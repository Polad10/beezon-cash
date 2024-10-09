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
<div class="max-w-screen-sm">
 <div class="text-black"> 
    <div class="flex justify-center py-4 bg-zinc-100">
      <p class="text-3xl font-bold">BEEZON CASH</p>
    </div>
    <div class="bg-white min-h-screen">
    <div role="tablist" class="tabs tabs-bordered grid-cols-3 py-7">
      <input type="radio" name="tab" role="tab" class="tab text-lg font-medium content-end leading-tight pb-1.5 text-accent" aria-label="Баланс аккаунта" checked />
      <div role="tabpanel" class="tab-content pt-7">
        <div class="flex justify-center">
          <div class="relative">
            <img src="./public/balance-card.svg" class="rounded-3xl" />
            <div class="absolute top-1/2 w-full px-5">
              <div class="flex flex-col">
                <div class="flex flex-row justify-between">
                  <div>
                    <p class="leading-none text-lg text-slate-300 font-light">Владелец карты</p>
                    <p class="text-lg text-white font-bold">Николаенко Ольга</p>
                  </div>
                  <div>
                    <p class="leading-none text-lg text-slate-300 font-light">Бонусы</p>
                    <p class="text-xl text-white font-bold text-center">12 ₾</p>
                  </div>
                </div>
                <div class="flex flex-row mt-3">
                  <div>
                    <p class="leading-none text-lg text-slate-300 font-light">Номер телефона</p>
                    <p class="text-lg text-white font-bold">+123456789</p>
                  </div>
                </div>
                <div class="flex flex-row mt-3">
                  <div>
                    <p class="leading-none text-lg text-slate-300 font-light">Telegram</p>
                    <p class="text-lg text-white font-bold">@username</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input type="radio" name="tab" role="tab" class="tab text-lg font-light content-end leading-tight pb-1.5 text-black" aria-label="Список заказов" />
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
      <input type="radio" name="tab" role="tab" class="tab text-lg font-light content-end leading-tight pb-1.5 text-black" aria-label="Пригласи друга" />
      <div role="tabpanel" class="tab-content p-5">
        <div class="flex flex-col items-center">
          <p class="text-xl font-regular text-center">Ваш промокод</p>
          <button class="btn btn-wide bg-accent text-xl mt-2 px-5 rounded-2xl hover:bg-accent-content" @click="showCopyToast">
            <div class="mx-auto text-white">RFID76564434</div>
            <div class="rounded-full bg-accent-content flex justify-center items-center p-1.5">
             <ion-icon name="copy-outline" class="text-white z-10"></ion-icon>
            </div>
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
                  Вам на баланс вернется 5% от стоимости первого заказа вашего друга
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="copyToastVisible" class="toast toast-center">
      <div class="alert alert bg-secondary text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-primary object-center">
        <span>Скопировано</span>
      </div>
    </div>
    <div v-if="bonusBalanceExceededToastVisible" class="toast toast-top whitespace-normal z-10 flex-row justify-between mt-4 mx-4">
      <div class="alert bg-orange-100 text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-orange-200 object-center">
        <ion-icon name="alert-circle" class="text-warning text-5xl ml-px"></ion-icon>
        <span>Вы списываете больше бонусов, чем есть на балансе</span>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>
