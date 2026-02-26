<script setup lang="ts">
import axios, { HttpStatusCode } from 'axios'
import Input from '~/components/Input.vue'
import Toast from '~/components/Toast.vue'

const loading = ref(false)
const errorMessage = ref('')
const showErrorToast = ref(false)

const username = ref('')
const password = ref('')

async function login() {
	try {
		loading.value = true

		await axios.post('/api/admin/login', { username: username.value, password: password.value })
		navigateTo('/admin', { replace: true })
	} catch (ex) {
		if (axios.isAxiosError(ex) && ex.response?.status === HttpStatusCode.Unauthorized) {
			errorMessage.value = 'Invalid username or password'
		} else {
			errorMessage.value = 'Something went wrong. Please try again later.'
		}

		showToast(showErrorToast)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<dialog class="modal modal-open" ref="modalRef">
		<div class="modal-box w-[77%]" tabindex="0">
			<p class="font-semibold text-center">Admin Login</p>
			<form @submit.prevent="login">
				<div class="flex flex-col gap-3 mt-5">
					<Input type="text" placeholder="Username" v-model="username" autofocus />
					<Input type="password" placeholder="Password" v-model="password" />
				</div>
				<button
					type="submit"
					class="btn btn-block bg-blue-700 text-white border-blue-700 mt-5 hover:bg-blue-800 hover:border-blue-800"
				>
					<span v-if="loading" class="loading loading-spinner"></span>
					<span v-else>Sign in</span>
				</button>
			</form>
		</div>
	</dialog>
	<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
</template>
