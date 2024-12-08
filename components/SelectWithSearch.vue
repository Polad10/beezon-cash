<script lang="ts" setup>
import Fuse from 'fuse.js'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  placeholder: string
  options: Array<any>
  fuseOptions: Fuse.IFuseOptions<any>
  getOptionString: (option: any) => string
}>()

const inputFocused = ref(false)
const search = ref('')

const inputRef = ref<HTMLInputElement | null>(null)

const inputText = computed(() => {
  return inputFocused.value || !selectedOption.value ? search.value : props.getOptionString(selectedOption.value)
})

let fuse = computed(() => {
  return new Fuse(props.options, props.fuseOptions)
})

const filteredOptions = computed(() => {
  if (!search.value) {
    return [...props.options]
  }

  return fuse.value.search(search.value).map((result) => result.item)
})

function handleInputBlur() {
  inputFocused.value = false
  search.value = ''
}

function setSearchValue(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  search.value = value
}

function clearSelectedOption(event: Event) {
  event.preventDefault()
  selectedOption.value = null
}

const selectedOption = defineModel()
</script>

<template>
  <div class="relative">
    <label class="form-control grow">
      <div class="label">
        <span class="label-text">User *</span>
      </div>
      <label
        class="input input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
        @focusin="inputFocused = true"
        @focusout="handleInputBlur"
        v-bind="$attrs"
      >
        <input
          ref="inputRef"
          type="text"
          class="grow"
          :placeholder="selectedOption ? getOptionString(selectedOption) : placeholder"
          :value="inputText"
          @input="setSearchValue"
        />
        <div>
          <ion-icon
            v-if="selectedOption"
            name="close"
            class="cursor-pointer mr-1"
            @click="clearSelectedOption"
          ></ion-icon>
          <ion-icon v-if="inputFocused" name="chevron-up" class="cursor-pointer" @click="inputRef?.blur()"></ion-icon>
          <ion-icon v-else name="chevron-down" class="cursor-pointer"></ion-icon>
        </div>
      </label>
    </label>
    <ul
      class="menu flex-nowrap w-full max-h-56 overflow-y-auto absolute bg-white border rounded mt-2"
      :class="{ hidden: !inputFocused }"
    >
      <li v-for="user in filteredOptions">
        <a :class="{ active: selectedOption == user }" @mousedown="selectedOption = user">{{
          getOptionString(user)
        }}</a>
      </li>
    </ul>
  </div>
</template>
