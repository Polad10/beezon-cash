export function showToast(toastVisible: Ref<boolean>) {
  toastVisible.value = true

  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}
