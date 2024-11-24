<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  label: string
  placeholder: string
}>()

const model = defineModel<string>()
</script>

<template>
  <label class="form-control">
    <div class="label">
      <span class="label-text">{{ props.label }}</span>
    </div>
    <textarea
      :placeholder="props.placeholder"
      class="textarea textarea-bordered focus-within:outline-0 focus-within:border-gray-500 h-36"
      v-model="model"
      v-bind="$attrs"
    ></textarea>
  </label>
</template>
