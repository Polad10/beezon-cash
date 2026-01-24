export function toISODate(date: Date) {
	return date.toISOString().split('T')[0]
}

export function formatDateRu(date: Date) {
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}
