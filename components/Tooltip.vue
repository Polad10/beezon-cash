<template>
	<div class="flex relative group">
		<div
			class="absolute hidden group-hover:block mt-5 text-xs rounded shadow bg-[#2B3440] text-[#D7DDE4] text-left p-2"
		>
			<slot name="content" />
		</div>
		<slot />
	</div>
</template>
