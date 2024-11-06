<script setup lang="ts">
import type { HTMLAttributes, InputTypeHTMLAttribute } from 'vue'

const props = defineProps<{
  type: InputTypeHTMLAttribute
  label: string
  placeholder: string
  class?: string
}>()
</script>

<template>
  <label class="form-control">
    <div class="label">
      <span class="label-text">{{ props.label }}</span>
    </div>
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      class="input input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
      :class="props.class"
    />
  </label>
</template>
