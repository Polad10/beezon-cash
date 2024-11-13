<script lang="ts" setup>
import { OrderStatus, toDisplayString } from '~/models/OrderStatus'

defineOptions({
  inheritAttrs: false,
})

const model = defineModel()
</script>

<template>
  <label class="form-control">
    <div class="label">
      <span class="label-text">Status *</span>
    </div>
    <select
      class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
      v-bind="$attrs"
      v-model="model"
    >
      <option value="null" disabled>Select a status</option>
      <option :value="OrderStatus.New">{{ toDisplayString(OrderStatus.New) }}</option>
      <option :value="OrderStatus.OnTheWay">{{ toDisplayString(OrderStatus.OnTheWay) }}</option>
      <option :value="OrderStatus.ArrivedInDestinationCountry">
        {{ toDisplayString(OrderStatus.ArrivedInDestinationCountry) }}
      </option>
      <option :value="OrderStatus.WaitingForPayment">
        {{ toDisplayString(OrderStatus.WaitingForPayment) }}
      </option>
      <option :value="OrderStatus.Delivered">{{ toDisplayString(OrderStatus.Delivered) }}</option>
    </select>
  </label>
</template>
