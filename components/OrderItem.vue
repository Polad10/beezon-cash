<script setup lang="ts">
import { ref } from 'vue'
import { OrderStatus, toDisplayString, toColorCode } from '~/server/utils/OrderStatus'

const props = defineProps<{
  bonusApplied: boolean
  bonusReceived?: number
  originalPrice: number
  currentPrice: number
  orderStatus: OrderStatus
  balanceIsSufficient: (bonus: number) => boolean
  applyBonus: (bonus: number) => void
}>()

const showBonusInput = ref(false)
const bonusApplied = ref(props.bonusApplied)
const bonusToggleChecked = ref(false)
const bonus = ref(0)
const currentPrice = ref(props.currentPrice)

const bonusOrderLimitExceededToastVisible = ref(false)

function toggleShowBonusInput(event: Event) {
  showBonusInput.value = bonusToggleChecked.value
}

function closeBonusInput() {
  showBonusInput.value = false
  bonusToggleChecked.value = false
  bonus.value = 0
}

function applyBonus() {
  if (!props.balanceIsSufficient(bonus.value)) {
    return
  }

  const bonusLimit = props.originalPrice / 2

  if (bonus.value > bonusLimit) {
    showBonusOrderLimitExceededToast()
  } else {
    props.applyBonus(bonus.value)
    currentPrice.value = props.originalPrice - bonus.value
    bonusApplied.value = true
    closeBonusInput()
  }
}

function showBonusOrderLimitExceededToast() {
  bonusOrderLimitExceededToastVisible.value = true

  setTimeout(() => {
    bonusOrderLimitExceededToastVisible.value = false
  }, 3000)
}
</script>

<template>
  <div class="card card-compact bg-neutral-100 mb-3">
    <div class="card-body">
      <div class="flex flex-row justify-between">
        <div :class="['badge', `badge-${toColorCode(orderStatus)}`,'text-white', 'h-7', 'rounded-xl']">{{ toDisplayString(orderStatus) }}</div>
        <div v-if="bonusReceived && bonusReceived > 0" class="badge bg-primary">+ {{ bonusReceived }}</div>
      </div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <p class="font-bold text-lg leading-none">Заказ #127767</p>
          <p class="font-thin opacity-50 leading-none">22 сентября 2024</p>
        </div>
        <div>
          <span
            v-if="bonusApplied"
            class="font-semibold text-2xl leading-none mr-2 line-through decoration-2 opacity-50"
            >{{ originalPrice }}</span
          >
          <span class="font-semibold text-2xl leading-none">{{ currentPrice }} ₾</span>
        </div>
      </div>
      <div class="divider opacity-50 m-0"></div>
      <div class="flex flex-row justify-between">
        <span class="text-base font-medium">Использовать бонусы</span>
        <input
          v-if="!bonusApplied && orderStatus == OrderStatus.WaitingForPayment"
          type="checkbox"
          class="toggle border-gray-300 bg-gray-300 checked:bg-blue-800 [--tglbg:white] checked:[--tglbg:white] checked:border-blue-800"
          @change="toggleShowBonusInput"
          v-model="bonusToggleChecked"
        />
        <ion-icon v-else-if="bonusApplied" name="checkmark-circle" class="text-3xl text-success"></ion-icon>
        <ion-icon v-else name="close-circle" class="text-3xl text-error"></ion-icon>
      </div>
      <div class="mt-3 collapse rounded-none" :class="{ 'collapse-open': showBonusInput }">
        <div class="collapse-content p-0">
          <label class="input input-bordered flex items-center border-gray-300 rounded-xl bg-white p-2">
            <span>₾</span>
            <input type="number" class="grow ml-2 bg-transparent border-none outline-none" placeholder="0" v-model="bonus" />
          </label>
          <div class="flex flex-row justify-between mt-2 mx-4">
            <button class="btn btn-ghost text-error text-base font-medium" @click="closeBonusInput">Отменить</button>
            <button class="btn btn-ghost text-accent text-base font-medium" @click="applyBonus">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="bonusOrderLimitExceededToastVisible" class="toast toast-top whitespace-normal z-10 flex-row justify-between mt-4 mx-4">
      <div class="alert alert-info text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center">
        <ion-icon name="close-circle-outline" class="text-error text-5xl ml-px"></ion-icon>
        <span>Можно списать не более 50% от суммы заказа</span>
      </div>
    </div>
  </div>
</template>
