<script lang="ts" setup>
const props = defineProps<{
  label: string
  showInputError: boolean
  required?: boolean
}>()

const model = defineModel<string>()
</script>

<template>
  <Textarea
    :label="label"
    placeholder="Введите список товаров"
    v-model="model"
    class="text-base"
    :class="{ 'textarea-error': showInputError }"
    label-class="font-medium pb-1"
    label-text-class="text-base"
    :required="props.required"
  />
</template>
