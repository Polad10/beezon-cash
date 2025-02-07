<script lang="ts" setup>
const model = defineModel()
</script>

<template>
  <CityDropdown
    label="В какой город Грузии требуется доставка?"
    placeholder="Выберите город"
    v-model="model"
    class="text-base"
    label-class="font-medium pb-1"
    label-text-class="text-base"
  />
</template>
