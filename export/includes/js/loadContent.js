// Check for currentPage
document.addEventListener("DOMContentLoaded", checkCurrentPage);

function checkCurrentPage() {
	let metadata = getState('metadata')
	let hasMetadata = isNotNil(metadata)
	let hasCurrentPage = hasMetadata ? isNotNil(metadata.routeTitle) : false

	
	if (hasCurrentPage) {
		let currentPage = metadata.currentPage

		loadContent(currentPage)
	} else {
		// Set default page if none is found
		const defaultPage = {
			currentPage: 'tracks',
		}

		loadContent(defaultPage)
	}
}

// List of valid pages to load
const pageList = {
	tracks: 'Tracks',
	playlists: 'Playlists',
	settings: 'Settings'
}

function loadContent (pageData) {
	// Reset Page Content
	const pageContent = document.querySelector('.export-content')
	pageContent.innerHTML = null

	// Load Page Content of a Valid Page
	let currentPage = pageData.currentPage
	let isContentRequestedValid = isNotNil(pageList[currentPage])

	if (isContentRequestedValid) {
		let pageTitle = pageList[currentPage]

		setPage(pageData)
		loadContentInfo(pageTitle)
		loadContentData(pageTitle)
	}
}

function loadContentInfo (pageTitle) {
	setPageTitle(pageTitle)
	selectActiveNavigationButton(pageTitle)
}

function loadContentData (pageTitle) {
	if (pageTitle === 'Tracks') {
		populateTracksLayout()
	} else if (pageTitle === 'Playlists') {
		populatePlaylistsLayout()
	} else if (pageTitle === 'Settings') {
		// Load Settings
	}
}

function setPage (pageData) {
	setState('metadata', pageData)
}

function setPageTitle (pageTitle) {
	document.title = 'Spotify to Excel | ' + pageTitle
	document.getElementById('contentHeader').innerHTML = pageTitle
}

function selectActiveNavigationButton (pageTitle) {
	let currentActiveButton = document.querySelector('.sidebar-button.active')
	let hasActiveButton = isNotNil(currentActiveButton)
	let selectedButtonId = 'visit' + pageTitle
	selectedButtonId = selectedButtonId.toString()
	let selectedButton = document.getElementById(selectedButtonId)

	if (hasActiveButton) {
		currentActiveButton.classList.remove('active')
	}

	selectedButton.classList.add('active')
}
