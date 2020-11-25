function populatePlaylistsLayout () {
	let exportContent = document.querySelector('.export-content')
	exportContent.append(createPlaylistsHeader())
}

function createPlaylistsHeader() {
	// Wrapper
	let wrapper = document.createElement('div')
	wrapper.classList.add('tracks-header')

	// Header
	let headerContainer = document.createElement('div')
	headerContainer.classList.add('tracks-header-container')
	let header = document.createElement('h1')
	header.innerText = "Playlists"
	header.classList.add('tracks-header__header')

	// Total Tracks
	let totalContainer = document.createElement('div')
	totalContainer.classList.add('tracks-header-container')
	let total = document.createElement('span')
	total.classList.add('tracks-header__total')

	// Append Nodes
	headerContainer.append(header)
	totalContainer.append(total)
	wrapper.append(headerContainer, totalContainer)

	return wrapper
}

function createTracksBody() {
	// Wrapper
	let wrapper = document.createElement('div')
	wrapper.classList.add('tracks-body')

	// Table
	const table = document.createElement('table')
	table.classList.add('tracks-table')
	wrapper.append(table)
	
	// Table Headers
	let getSettings = getState('settings')
	let isHeadersEnabled = getSettings.fileHeaders
	let exportFormat = getSettings.exportFormat
	let formatLength = exportFormat.length

	if (isHeadersEnabled) {
		const headers = document.createElement('tr')
		headers.classList.add('tracks-table__header')
		for (let i = 0; i < formatLength; i += 1) {
			let headerData = document.createElement('td')
			headerData.classList.add('tracks-table__header-item')
			headerData.innerText = exportFormat[i]

			headers.append(headerData)
		}
		table.append(headers)
	}

	getLikedTracks(0)

	return wrapper
}

function createTracksFooter() {
	// Wrapper
	let wrapper = document.createElement('div')
	wrapper.classList.add('tracks-footer')

	// Export Container
	let exportContainer = document.createElement('div')
	exportContainer.classList.add('tracks-footer__export')

	// Export Label
	let exportLabel = document.createElement('label')
	exportLabel.classList.add('tracks-footer__export-label', 'hidden')
	exportLabel.setAttribute('for', 'exportButton')

	// Export Button
	let exportButton = document.createElement('button')
	exportButton.id = 'exportButton'
	exportButton.classList.add('tracks-footer__export-button', 'f-md', 'btn', 'valid', 'hidden')
	exportButton.setAttribute('name', 'exportButton')
	exportButton.setAttribute('title', 'export as excel sheet')
	exportButton.innerText = "Export"

	exportButton.addEventListener('click', exportExcelFromTable)

	// Append Nodes
	exportContainer.append(exportLabel, exportButton)
	wrapper.append(exportContainer)

	return wrapper
}

async function getLikedTracks(offset) {
	const limit = '?limit=' + 50
	offset = '&offset=' + offset
	const authState = getState('auth')

	let data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/me/tracks/' + limit + offset, // /me/playlists
		headers: {
			'Authorization': authState.tokenType + ' ' + authState.accessToken,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		let isAvailableLikedTracks = isEndOfLikedTracks(response.data)

		if (isAvailableLikedTracks) {
			let currentOffset = response.data.offset
			const limit = 50
			const newOffset = currentOffset + limit
	
			// Display Tracks and Seek Next Offset
			updateLoadingStatus(response.data)
			displayTracks(response.data)
			getLikedTracks(newOffset)
		} else {
			// Render export button after load
			const exportButton = document.querySelector('.tracks-footer__export-button')
			let isExportEnabled = document.querySelector('.tracks-footer__export-button.hidden') === null ? false : true

			if (isExportEnabled) {
				exportButton.classList.remove('hidden')
			}
		}
	})
	.catch((error) => {
		let errorCode = error.response.status

		console.error('tracks.js > getLikedTracks() > Error Code:', errorCode)
		openError('Failure to get liked tracks!', errorCode)

		return error
	})

	return data
}
