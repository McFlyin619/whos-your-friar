import { ref, computed } from 'vue'

export default function handlePagination (dataArray) {
	const page = ref(1)

	// const data = Array.from(dataArray).map((item) => {
	// 	return { index: item, value: `this_${item}` }
	// })

	const perPage = 10

	const paginatedData = computed(() => dataArray.slice((page.value - 1) * perPage, page.value * perPage))

	const nextPage = () => {
		if (page.value !== Math.ceil(dataArray.length / perPage)) {
			page.value += 1
		}
	}

	const backPage = () => {
		if (page.value !== 1) {
			page.value -= 1
		}
	}

	const goToPage = (numPage) => {
		page.value = numPage
	}

	return { dataArray, paginatedData, perPage, page, nextPage, backPage, goToPage }
}
