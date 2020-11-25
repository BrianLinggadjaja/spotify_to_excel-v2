function populateTracksLayout () {
	let exportContent = document.querySelector('.export-content')
	exportContent.append(createTracksHeader(), createTracksBody(), createTracksFooter())
}

function createTracksHeader() {
	// Wrapper
	let wrapper = document.createElement('div')
	wrapper.classList.add('tracks-header')

	// Header
	let headerContainer = document.createElement('div')
	headerContainer.classList.add('tracks-header-container')
	let header = document.createElement('h1')
	header.innerText = "Liked Tracks"
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
		url: 'https://api.spotify.com/v1/me/tracks/' + limit + offset,
		headers: {
			'Authorization': authState.tokenType + ' ' + authState.accessToken,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		response = response.data
		let isAvailableLikedTracks = isEndOfLikedTracks(response)

		if (isAvailableLikedTracks) {
			let currentOffset = response.offset
			const limit = 50
			const newOffset = currentOffset + limit
	
			// Display Tracks and Seek Next Offset
			updateLoadingStatus(response)
			displayTracks(response)
			getLikedTracks(newOffset)
		} else {
			// Render export button after load
			const exportButton = document.querySelector('.tracks-footer__export-button')
			let isExportEnabled = document.querySelector('.tracks-footer__export-button.hidden') === null ? false : true

			if (isExportEnabled) {
				exportButton.classList.remove('hidden')

				// Re-enable navigation buttons
				toggleNavigation(true)
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

function isEndOfLikedTracks(response) {
	let trackOffset = parseInt(response.offset)
	let totalLikedTracks = parseInt(response.total)
	let shouldSeekNextTracks = (trackOffset <= totalLikedTracks)

	return shouldSeekNextTracks
}

function updateLoadingStatus(response) {
	const totalTracks = document.querySelector('.tracks-header__total')
	let itemsLength = response.items.length
	let tracksLoaded = itemsLength + response.offset
	totalTracks.innerText = 'Tracks Loaded: ' + tracksLoaded + '/' + response.total
}

let indexCount = 0
async function displayTracks(tracks) {
	const trackItem = tracks.items
	const tracksLength = tracks.items.length
	const table = document.querySelector('table')

	for (let i = 0; i < tracksLength; i += 1) {
		// Track 
		let track = document.createElement('tr')
		track.classList.add('tracks-body__track')

		/// Track Info
		let trackInfo = document.createElement('td')
		trackInfo.classList.add('track-body__track-info')
		trackInfo.innerText = trackItem[i].track.name

		let exportFormat = getState('settings').exportFormat
		let formatLength = exportFormat.length

		for (let j = 0; j < formatLength; j += 1) {
			let trackData = trackItem[i].track
			let formatItem = exportFormat[j]
			let trackInfo = document.createElement('td')
			trackInfo.classList.add('track-body__track-info')

			switch (formatItem) {
				case 'index':
				trackInfo.classList.add('index')
				trackInfo.innerText = ++indexCount
				break

				case 'name':
				trackInfo.classList.add('name')
				trackInfo.innerText = trackData.name
				break

				case 'artist':
				trackInfo.classList.add('artist')
				trackInfo.innerText = trackData.artists[0].name
				break

				case 'genre':
				let artistGenre = await getArtistGenre(trackData.artists[0].id)
				trackInfo.classList.add('genre')
				trackInfo.innerText = artistGenre
				break

				case 'album':
				trackInfo.classList.add('album')
				trackInfo.innerText = trackData.album.name
				break
			}

			track.append(trackInfo)
		}

		table.append(track)
	}
}

async function getArtistGenre(artistsId) {
	const authState = getState('auth')
	let genre = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/artists/'
		+ artistsId,
		headers: {
			'Authorization': authState.tokenType + ' ' + authState.accessToken,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		/*	Returns all Genres
			* let allGenres = response.data.genres
			* return allGenres
			*/
		let firstGenre = response.data.genres[0]
		return firstGenre
	})
	.catch((error) => {
		let errorCode = error.response.status

		console.error('tracks.js > getArtistGenre() > Error Code:', errorCode)
		openError('Failure to get artists genre!', errorCode)

		return null
	})

	return genre
}
