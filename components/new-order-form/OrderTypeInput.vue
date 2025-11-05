<script lang="ts" setup>
import { OrderType } from '~/models/OrderTypeMapping'

const model = defineModel()
</script>

<template>
	<div>
		<label class="label cursor-pointer justify-normal items-start gap-2">
			<input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Drugs" v-model="model" />
			<div class="flex flex-col">
				<span class="font-medium">В заказе лекарства или БАДы</span>
				<span class="text-sm font-light leading-4">Для лекарств и БАДов действует наценка 10 лари/упаковка </span>
			</div>
		</label>
		<label class="label cursor-pointer justify-normal items-start gap-2">
			<input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Electronics" v-model="model" />
			<div class="flex flex-col">
				<span class="font-medium">В заказе товары дороже 300 лари</span>
				<span class="text-sm font-light leading-4"
					>На провоз товаров дороже 300 лари без растаможивания может действовать наценка +10% от стоимости товара</span
				>
			</div>
		</label>
		<label class="label cursor-pointer justify-normal items-start gap-2">
			<input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Commercial" v-model="model" />
			<div class="flex flex-col">
				<span class="font-medium">В заказе 5 и более штук одинаковых товаров</span>
				<span class="text-sm font-light leading-4"
					>Согласуйте с менеджером состав вашего заказа, т.к. он может попасть под понятие “коммерческая партия”, на
					который будет действовать дополнительная наценка</span
				>
			</div>
		</label>
	</div>
</template>
