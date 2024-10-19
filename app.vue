<script setup lang="ts">
useHead({
  title: 'Test',
  link: [
    {
      rel: 'stylesheet',
      type: 'text/css',
      href: 'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css',
    },
  ],
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
    },
    {
      type: 'module',
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
    },
    {
      nomodule: true,
      src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
