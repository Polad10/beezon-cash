<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '~/models/Order'
import { OrderStatus, toDisplayString, toColorCode } from '~/models/OrderStatus'

const props = defineProps<{
  order: Order
  balanceIsSufficient: (bonus: number) => boolean
  applyBonus: (bonus: number) => void
}>()

const showBonusInput = ref(false)
const bonusApplied = ref(props.order.current_price != props.order.original_price)
const bonusToggleChecked = ref(false)
const bonus = ref(0)
const currentPrice = ref(props.order.current_price)

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

  const bonusLimit = props.order.original_price / 2

  if (bonus.value > bonusLimit) {
    showBonusOrderLimitExceededToast()
  } else {
    props.applyBonus(bonus.value)
    currentPrice.value = props.order.original_price - bonus.value
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
  <div class="card card-compact bg-neutral mb-3">
    <div class="card-body">
      <div class="flex flex-row justify-between">
        <div :class="['badge', `badge-${toColorCode(order.status)}`]">{{ toDisplayString(order.status) }}</div>
        <div v-if="order.bonus_received && order.bonus_received > 0" class="badge">+ {{ order.bonus_received }}</div>
      </div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <p class="font-bold text-lg leading-none">Заказ #{{ order.code }}</p>
          <p class="font-thin opacity-50 leading-none">
            {{ order.date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>
        <div>
          <span
            v-if="bonusApplied"
            class="font-semibold text-2xl leading-none mr-2 line-through decoration-2 opacity-50"
            >{{ order.original_price }}</span
          >
          <span class="font-semibold text-2xl leading-none">{{ currentPrice }} ₾</span>
        </div>
      </div>
      <div class="divider opacity-50 m-0"></div>
      <div class="flex flex-row justify-between">
        <span class="font-bold">Использовать бонусы</span>
        <input
          v-if="!bonusApplied && order.status == OrderStatus.WaitingForPayment"
          type="checkbox"
          class="toggle toggle-primary"
          @change="toggleShowBonusInput"
          v-model="bonusToggleChecked"
        />
        <ion-icon v-else-if="bonusApplied" name="checkmark-circle-outline" class="text-2xl text-success"></ion-icon>
        <ion-icon v-else name="lock-closed-outline" class="text-2xl text-error"></ion-icon>
      </div>
      <div class="mt-3 collapse rounded-none" :class="{ 'collapse-open': showBonusInput }">
        <div class="collapse-content p-0">
          <label class="input input-bordered flex items-center">
            <span>₾</span>
            <input type="number" class="grow ml-2" placeholder="0" v-model="bonus" />
          </label>
          <div class="flex flex-row justify-between">
            <button class="btn btn-ghost text-error" @click="closeBonusInput">Отменить</button>
            <button class="btn btn-ghost text-primary" @click="applyBonus">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="bonusOrderLimitExceededToastVisible" class="toast toast-top whitespace-normal z-10">
      <div class="alert alert-error">
        <span>Можно списать не более 50% от суммы заказа</span>
      </div>
    </div>
  </div>
</template>
