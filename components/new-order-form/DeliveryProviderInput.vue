<script lang="ts" setup>
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'
import FormInput from '~/components/new-order-form/FormInput.vue'

defineProps<{
	label: string
	showAsterisk?: boolean
}>()

defineExpose({ validate, resetErrors })

const deliveryProviders = defineModel<DeliveryProvider[]>({ required: true })
const cdekTrackNumber = defineModel<string>('cdekTrackNumber', { required: true })
const postTrackNumber = defineModel<string>('postTrackNumber', { required: true })
const boxberryTrackNumber = defineModel<string>('boxberryTrackNumber', { required: true })
const post5TrackNumber = defineModel<string>('post5TrackNumber', { required: true })
const dpdTrackNumber = defineModel<string>('dpdTrackNumber', { required: true })
const aptekaRuTrackNumber = defineModel<string>('aptekaRuTrackNumber', { required: true })

const showDeliveryProviderInputError = ref(false)
const showCdekTrackNumberInputError = ref(false)
const showPostTrackNumberInputError = ref(false)
const showBoxberryTrackNumberInputError = ref(false)
const showPost5TrackNumberInputError = ref(false)
const showDpdTrackNumberInputError = ref(false)
const showAptekaRuTrackNumberInputError = ref(false)

function validate(): boolean {
	resetErrors()
	let valid = true

	if (!deliveryProviders.value || deliveryProviders.value.length === 0) {
		showDeliveryProviderInputError.value = true
		valid = false
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.CDEK) && !cdekTrackNumber.value) {
		valid = false
		showCdekTrackNumberInputError.value = true
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.PostRussia) && !postTrackNumber.value) {
		valid = false
		showPostTrackNumberInputError.value = true
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.POST5) && !post5TrackNumber.value) {
		valid = false
		showPost5TrackNumberInputError.value = true
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.Boxberry) && !boxberryTrackNumber.value) {
		valid = false
		showBoxberryTrackNumberInputError.value = true
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.DPD) && !dpdTrackNumber.value) {
		valid = false
		showDpdTrackNumberInputError.value = true
	}

	if (deliveryProviders.value?.includes(DeliveryProvider.AptekaRu) && !aptekaRuTrackNumber.value) {
		valid = false
		showAptekaRuTrackNumberInputError.value = true
	}

	return valid
}

function resetErrors() {
	showDeliveryProviderInputError.value = false
	showCdekTrackNumberInputError.value = false
	showPostTrackNumberInputError.value = false
	showBoxberryTrackNumberInputError.value = false
	showPost5TrackNumberInputError.value = false
	showDpdTrackNumberInputError.value = false
	showAptekaRuTrackNumberInputError.value = false
}

function sanitizeTrackNumber(value: string): string {
	// Remove all characters except letters and numbers
	return value.replace(/[^a-zA-Z0-9-]/g, '')
}

// Watch and sanitize track numbers
watch(cdekTrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		cdekTrackNumber.value = sanitized
	}
})

watch(postTrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		postTrackNumber.value = sanitized
	}
})

watch(boxberryTrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		boxberryTrackNumber.value = sanitized
	}
})

watch(post5TrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		post5TrackNumber.value = sanitized
	}
})

watch(dpdTrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		dpdTrackNumber.value = sanitized
	}
})

watch(aptekaRuTrackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		aptekaRuTrackNumber.value = sanitized
	}
})
</script>

<template>
	<div>
		<div class="label font-medium pb-1">
			<span>{{ label }}</span>
		</div>
		<div :class="{ 'border rounded-lg border-[red]': showDeliveryProviderInputError }">
			<div class="flex flex-row gap-x-1 flex-wrap">
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.Ozon"
						v-model="deliveryProviders"
						data-cy="ozon"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Ozon) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.Wilbderries"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Wilbderries) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.CDEK"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.CDEK) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.PostRussia"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.PostRussia) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.POST5"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.POST5) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.Boxberry"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Boxberry) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.DPD"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.DPD) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.Cold"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Cold) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.AptekaRu"
						v-model="deliveryProviders"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.AptekaRu) }}</span>
				</label>
			</div>
		</div>
		<!-- Track number inputs -->
		<div class="flex flex-col gap-2 mt-2">
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.CDEK)"
				:label="`Трек-номер CDEK${showAsterisk ? ' *' : ''}`"
				v-model="cdekTrackNumber"
				:show-input-error="showCdekTrackNumberInputError"
			/>
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.PostRussia)"
				:label="`Трек-номер Почты России${showAsterisk ? ' *' : ''}`"
				v-model="postTrackNumber"
				:show-input-error="showPostTrackNumberInputError"
			/>
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.POST5)"
				:label="`Трек-номер 5POST${showAsterisk ? ' *' : ''}`"
				v-model="post5TrackNumber"
				:show-input-error="showPost5TrackNumberInputError"
			/>
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.Boxberry)"
				:label="`Трек-номер Boxberry${showAsterisk ? ' *' : ''}`"
				v-model="boxberryTrackNumber"
				:show-input-error="showBoxberryTrackNumberInputError"
			/>
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.DPD)"
				:label="`Трек-номер DPD${showAsterisk ? ' *' : ''}`"
				v-model="dpdTrackNumber"
				:show-input-error="showDpdTrackNumberInputError"
			/>
			<FormInput
				v-if="deliveryProviders?.includes(DeliveryProvider.AptekaRu)"
				:label="`Трек-номер Аптека.ру${showAsterisk ? ' *' : ''}`"
				v-model="aptekaRuTrackNumber"
				:show-input-error="showAptekaRuTrackNumberInputError"
			/>
		</div>
	</div>
</template>
