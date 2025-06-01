<script lang="ts" setup>
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'

defineProps<{
	label: string
	showInputError: boolean
}>()

const model = defineModel()
</script>

<template>
	<div>
		<div class="label font-medium pb-1">
			<span>{{ label }}</span>
		</div>
		<div :class="{ 'border rounded-lg border-[red]': showInputError }">
			<div class="flex flex-row gap-x-1 flex-wrap">
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input
						type="checkbox"
						class="checkbox checkbox-sm"
						:value="DeliveryProvider.Ozon"
						v-model="model"
						data-cy="ozon"
					/>
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Ozon) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.Wilbderries" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Wilbderries) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.CDEK" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.CDEK) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.PostRussia" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.PostRussia) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.POST5" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.POST5) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.Boxberry" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Boxberry) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.DPD" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.DPD) }}</span>
				</label>
				<label class="label cursor-pointer justify-normal gap-2 font-light">
					<input type="checkbox" class="checkbox checkbox-sm" :value="DeliveryProvider.Cold" v-model="model" />
					<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Cold) }}</span>
				</label>
			</div>
		</div>
	</div>
</template>
