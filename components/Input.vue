<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  type: InputTypeHTMLAttribute
  label?: string
  placeholder: string
}>()

const model = defineModel()
</script>

<template>
  <label class="form-control grow">
    <div class="label" v-if="props.label">
      <span class="label-text">{{ props.label }}</span>
    </div>
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      class="input input-bordered focus-within:outline-0 focus-within:border-gray-500"
      v-model="model"
      v-bind="$attrs"
    />
  </label>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
