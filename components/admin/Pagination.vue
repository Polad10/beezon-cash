<script lang="ts" setup>
const props = defineProps<{
  pageNr: number
  maxPageNr: number
}>()

const emit = defineEmits(['page-nr-changed'])

function setPageNr(newPageNr: number) {
  emit('page-nr-changed', newPageNr)
}

function pageNrIsInBetween(pageNr: number) {
  return pageNr > 1 && pageNr < props.maxPageNr
}
</script>

<template>
  <div class="mt-auto mb-5 self-center join">
    <button class="join-item btn btn-ghost" :class="{ 'btn-disabled': pageNr == 1 }" @click="setPageNr(pageNr - 1)">
      {{ '«' }}
    </button>
    <button class="join-item btn btn-ghost" :class="{ 'btn-active': pageNr == 1 }" @click="setPageNr(1)">1</button>
    <button v-if="pageNrIsInBetween(pageNr - 2)" class="join-item btn btn-ghost btn-disabled dots">...</button>
    <button v-if="pageNrIsInBetween(pageNr - 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr - 1)">
      {{ pageNr - 1 }}
    </button>
    <button v-if="pageNrIsInBetween(pageNr)" class="join-item btn btn-active" @click="setPageNr(pageNr)">
      {{ pageNr }}
    </button>
    <button v-if="pageNrIsInBetween(pageNr + 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr + 1)">
      {{ pageNr + 1 }}
    </button>
    <button v-if="pageNrIsInBetween(pageNr + 2)" class="join-item btn btn-ghost btn-disabled dots">...</button>
    <button
      v-if="maxPageNr > 1"
      class="join-item btn btn-ghost"
      @click="setPageNr(maxPageNr)"
      :class="{ 'btn-active': pageNr == maxPageNr }"
    >
      {{ maxPageNr }}
    </button>
    <button
      class="join-item btn btn-ghost"
      :class="{ 'btn-disabled': pageNr == maxPageNr }"
      @click="setPageNr(pageNr + 1)"
    >
      {{ '»' }}
    </button>
  </div>
</template>

<style scoped>
.btn-active {
  background-color: black;
  color: white;
}
.dots {
  background-color: transparent;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
