<script lang="ts" setup>
const props = defineProps({
  maxPageNr: {
    type: Number,
    required: true,
  },
})

const pageNr = defineModel<number>({ default: 1 })

function setPageNr(newPageNr: number) {
  pageNr.value = newPageNr
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
    <button v-if="pageNrIsInBetween(pageNr - 2)" class="join-item btn btn-ghost btn-disabled disabled: bg-black">
      ...
    </button>
    <button v-if="pageNrIsInBetween(pageNr - 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr - 1)">
      {{ pageNr - 1 }}
    </button>
    <button
      v-if="pageNrIsInBetween(pageNr)"
      class="join-item btn btn-ghost btn-active bg-white"
      @click="setPageNr(pageNr)"
    >
      {{ pageNr }}
    </button>
    <button v-if="pageNrIsInBetween(pageNr + 1)" class="join-item btn btn-ghost" @click="setPageNr(pageNr + 1)">
      {{ pageNr + 1 }}
    </button>
    <button v-if="pageNrIsInBetween(pageNr + 2)" class="join-item btn btn-ghost btn-disabled bg-white">...</button>
    <button
      v-if="pageNr > 1"
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
