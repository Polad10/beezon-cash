<script setup lang="ts">
// One-time cleanup: these order-form cookies were originally saved without an
// explicit path, so browsers defaulted them to site-wide (Path=/) and they were
// sent on every request. They've since been scoped to their own page's path;
// this removes the old site-wide copies so they stop piling onto every request.
onMounted(() => {
	const legacyOrderCookieNames = ['user-order-cookie', 'user-geruorder-cookie', 'user-geeuorder-cookie']

	for (const name of legacyOrderCookieNames) {
		document.cookie = `${name}=; Path=/; Max-Age=0`
	}
})

useHead({
	link: [
		{
			rel: 'stylesheet',
			type: 'text/css',
			href: 'https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css',
		},
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
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
