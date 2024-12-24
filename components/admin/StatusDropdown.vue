<script lang="ts" setup>
import { OrderStatus, toAdminDisplayString } from '~/models/OrderStatus'

defineProps({
  label: {
    type: String,
    required: false,
  },
  formControlClass: {
    type: String,
    required: false,
  },
})

defineOptions({
  inheritAttrs: false,
})

const model = defineModel()
</script>

<template>
  <label class="form-control" :class="formControlClass">
    <div v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <select
      class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
      v-bind="$attrs"
      v-model="model"
    >
      <option value="null" disabled>Select a status</option>
      <option :value="OrderStatus.New">{{ toAdminDisplayString(OrderStatus.New) }}</option>
      <option :value="OrderStatus.WarehouseRF">{{ toAdminDisplayString(OrderStatus.WarehouseRF) }}</option>
      <option :value="OrderStatus.Courier1">
        {{ toAdminDisplayString(OrderStatus.Courier1) }}
      </option>
      <option :value="OrderStatus.Courier2">
        {{ toAdminDisplayString(OrderStatus.Courier2) }}
      </option>
      <option :value="OrderStatus.ProcessedInTbilisi">
        {{ toAdminDisplayString(OrderStatus.ProcessedInTbilisi) }}
      </option>
      <option :value="OrderStatus.ReadyForDeliveryInTbilisi">
        {{ toAdminDisplayString(OrderStatus.ReadyForDeliveryInTbilisi) }}
      </option>
      <option :value="OrderStatus.WarehouseTbilisi">{{ toAdminDisplayString(OrderStatus.WarehouseTbilisi) }}</option>
      <option :value="OrderStatus.ReadyForDeliveryByPony">
        {{ toAdminDisplayString(OrderStatus.ReadyForDeliveryByPony) }}
      </option>
      <option :value="OrderStatus.WaitingForDeliveryByPony">
        {{ toAdminDisplayString(OrderStatus.WaitingForDeliveryByPony) }}
      </option>
      <option :value="OrderStatus.Delivered">{{ toAdminDisplayString(OrderStatus.Delivered) }}</option>
    </select>
  </label>
</template>
