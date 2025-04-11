<script setup lang="ts">
import Decimal from 'decimal.js'
import { ref } from 'vue'
import type { Order } from '~/models/Order'
import { OrderStatus, toClientDisplayString, toClientColorCode } from '~/models/OrderStatus'

const props = defineProps<{
  order: Order
  applyBonus: (orderId: string, bonus: Decimal) => Promise<boolean>
}>()

const order = props.order
const showBonusInput = ref(false)
const bonusToggleChecked = ref(false)
const bonus = ref<number | null>(null)

const bonusDecimal = computed(() => {
  if (bonus.value === null) {
    return null
  }

  return new Decimal(bonus.value)
})

const bonusApplied = computed(() => {
  return !order.current_price.equals(order.original_price)
})

function toggleShowBonusInput(event: Event) {
  showBonusInput.value = bonusToggleChecked.value
}

function closeBonusInput() {
  showBonusInput.value = false
  bonusToggleChecked.value = false
  bonus.value = 0
}

async function applyBonus() {
  if (await props.applyBonus(order.id, bonusDecimal.value!)) {
    closeBonusInput()
  }
}

function orderStatusEligibleForBonus(orderStatus: OrderStatus) {
  return (
    orderStatus == OrderStatus.ReadyForDeliveryInTbilisi ||
    orderStatus == OrderStatus.WarehouseTbilisi ||
    orderStatus == OrderStatus.ReadyForDeliveryByPony ||
    orderStatus == OrderStatus.WaitingForDeliveryByPony
  )
}
</script>

<template>
  <div class="card card-compact bg-neutral-100 mb-3">
    <div class="card-body">
      <div class="flex flex-row justify-between">
        <div
          :class="[
            'badge',
            `bg-[${toClientColorCode(order.status)}]`,
            `border-[${toClientColorCode(order.status)}]`,
            'font-semibold',
            'h-7',
            'rounded-lg',
          ]"
        >
          {{ toClientDisplayString(order.status) }}
        </div>
        <div v-if="order.bonus_received && order.bonus_received.greaterThan(0)" class="badge bg-primary">
          + {{ order.bonus_received }}
        </div>
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
          <span class="font-semibold text-2xl leading-none"
            >{{ order.status >= OrderStatus.ReadyForDeliveryInTbilisi ? order.current_price : 0 }} ₾</span
          >
        </div>
      </div>
      <div class="divider opacity-50 m-0"></div>
      <div class="flex flex-row justify-between">
        <span class="text-base font-medium">Использовать бонусы</span>
        <input
          v-if="!bonusApplied && orderStatusEligibleForBonus(order.status)"
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
          <label class="input input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center">
            <span>₾</span>
            <input
              type="number"
              class="grow ml-2"
              :placeholder="`Не более ${getMaxDiscountAmount(order)}`"
              v-model="bonus"
              enterkeyhint="done"
              @keydown.enter=";($event.target as HTMLInputElement).blur()"
            />
          </label>
          <div class="flex flex-row justify-between mt-2 mx-4">
            <button class="btn btn-ghost text-error text-base font-medium" @click="closeBonusInput">Отменить</button>
            <button
              :disabled="!bonus"
              class="btn btn-ghost text-accent text-base font-medium disabled:bg-transparent"
              @click="applyBonus"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
