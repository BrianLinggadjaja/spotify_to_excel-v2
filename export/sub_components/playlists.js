function populatePlaylistsLayout () {
	createPlaylistSelector()
	getPlaylists(0)
}

function createPlaylistSelector () {
	const content = document.querySelector('.export-content')

	// Add a wrapper div around playlists
	const wrapper = document.createElement('div')
	wrapper.classList.add('playlists-wrapper')

	// Create the playlists div
	const playlists = document.createElement('div')
	playlists.classList.add('playlists')

	// Append elements to the main content
	wrapper.appendChild(playlists)
	content.appendChild(wrapper)
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

async function getPlaylists(offset) {
	const authState = getState('auth')
	const limit = '?limit=' + 50
	offset = '&offset=' + offset

	let data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/me/playlists' + limit + offset,
		headers: {
			'Authorization': authState.tokenType + ' ' + authState.accessToken,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		response = response.data
		const newOffset = response.offset + 50
		const isFullPlaylist = (newOffset >= response.total)

		// Append all playlists
		for (const playlistsObj of response.items) {
			const playlistName = playlistsObj.name
			const playlistImage = playlistsObj.images[0].url
			const playlistId = playlistsObj.id
			
			// Add a new playlist entry to the list
			addPlaylistEntry(playlistName, playlistImage, playlistId)
		}

		if (isFullPlaylist) {
			toggleNavigation(true)
		} else {
			getPlaylists(newOffset)
		}
	})
	.catch((error) => {
		let errorCode = error.response.status

		console.error('tracks.js > getLikedTracks() > Error Code:', errorCode)
		openError('Failure to get liked tracks!', errorCode)

		return error
	})

	addPlaylistEventListeners()

	return data
}

function addPlaylistEntry (playlistName, playlistImage, playlistId) {
	const content = document.querySelector('.playlists')

	// Create playlist nodes
	const playlistElem = document.createElement('div')
	playlistElem.classList.add('playlist-item')
	playlistElem.dataset.id = playlistId

	const playlistImageWrapper = document.createElement('div')
	playlistImageWrapper.classList.add('playlist-item__image-wrapper')

	const playlistImageElem = document.createElement('img')
	playlistImageElem.src = playlistImage
	playlistImageElem.classList.add('playlist-item__image')
	playlistImageElem.alt = 'Playlist Preview'

	const playlistNameElem = document.createElement('span')
	playlistNameElem.classList.add('playlist-item__name')
	playlistNameElem.innerText = playlistName

	// Append playlist child nodes
	playlistImageWrapper.appendChild(playlistImageElem)
	playlistElem.appendChild(playlistImageWrapper)
	playlistElem.appendChild(playlistNameElem)
	content.append(playlistElem)
}

function addPlaylistEventListeners () {
	const playlistElem = document.querySelectorAll('.playlist-item')

	for (const playlistItem of playlistElem) {
		const playlistId = playlistItem.dataset.id
		playlistItem.addEventListener('click', loadTracks.bind(this, playlistId))
	}
}

function loadTracks (playlistId) {
	clearContent()
	populateTracksLayout()
	toggleNavigation(false)
	seekTracks(playlistId, 0)
}

async function seekTracks(id, offsetNumber) {
	const authState = getState('auth')
	const limit = '?limit=' + 50
	let offset = '&offset=' + offsetNumber

	let data = await axios({
		method: 'get',
		url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks/' + limit + offset,
		headers: {
			'Authorization': authState.tokenType + ' ' + authState.accessToken,
			'content-type': 'application/json'
		}
	})
	.then((response) => {
		response = response.data
		const newOffset = response.offset + 50
		const isFullPlaylist = (newOffset >= response.total)

		displayTracks(response)

		if (isFullPlaylist) {
			// Render export button after load
			const exportButton = document.querySelector('.tracks-footer__export-button')
			let isExportEnabled = document.querySelector('.tracks-footer__export-button.hidden') === null ? false : true

			if (isExportEnabled) {
				exportButton.classList.remove('hidden')

				// Re-enable navigation buttons
				toggleNavigation(true)
			}
		} else {
			updateLoadingStatus(response)
			seekTracks(id, newOffset)
		}

		updateLoadingStatus(response)
	})
	.catch((error) => {
		let errorCode = error.response.status

		console.error('tracks.js > getLikedTracks() > Error Code:', errorCode)
		openError('Failure to get liked tracks!', errorCode)

		return error
	})

	return data
}
