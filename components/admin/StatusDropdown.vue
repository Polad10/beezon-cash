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
  placeholder: {
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
      <option :value="null" disabled>{{ placeholder || 'Select a status' }}</option>
      <option v-for="status in Object.values(OrderStatus).filter((v) => typeof v == 'number')" :value="status">
        {{ toAdminDisplayString(status) }}
      </option>
    </select>
  </label>
</template>
