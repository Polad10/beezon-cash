<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  label: string
  placeholder: string
  labelClass?: string
  labelTextClass?: string
}>()

const model = defineModel<string>()
</script>

<template>
  <label class="form-control">
    <div class="label" :class="labelClass">
      <span class="label-text" :class="labelTextClass">{{ props.label }}</span>
    </div>
    <textarea
      :placeholder="props.placeholder"
      class="textarea textarea-bordered focus-within:outline-0 focus-within:border-gray-500 h-36"
      v-model="model"
      v-bind="$attrs"
      enterkeyhint="done"
      @keydown.enter=";($event.target as HTMLInputElement).blur()"
    ></textarea>
  </label>
</template>
