<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

defineProps({
  iconName: {
    type: String,
    required: true,
  },
  iconProps: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="toast toast-top whitespace-normal z-[9999] inset-x-0 top-0 mx-auto w-[200px]">
    <div class="alert text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border object-center" v-bind="$attrs">
      <ion-icon :name="iconName" class="text-xl ml-px" :class="iconProps"></ion-icon>
      <span>{{ message }}</span>
    </div>
  </div>
</template>
