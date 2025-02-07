<script lang="ts" setup>
defineProps<{
  label: string
  showInputError: boolean
}>()

const model = defineModel()
</script>

<template>
  <Input
    :label="label"
    type="text"
    placeholder="123456789"
    v-model="model"
    :class="{ 'input-error': showInputError }"
    label-class="font-medium pb-1"
    label-text-class="text-base"
  />
</template>
