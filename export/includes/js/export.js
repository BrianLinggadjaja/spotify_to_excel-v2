function exportExcelFromTable() {
	const table = document.querySelector('table')
	let workbook = XLSX.utils.table_to_book(table)
	let fileName = getState('settings').fileName

	XLSX.writeFile(workbook, fileName + '.xlsx', {bookType:'xlsx',  type: 'string'})
}