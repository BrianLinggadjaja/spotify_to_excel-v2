// Run skipNavigation when pressed "enter" on the Skip Nav button
const skipNavigationButton = document.getElementById('skipNav')
skipNavigationButton.addEventListener('click', skipNavigation)

function skipNavigation() {
    const content = document.querySelector('main')
    content.setAttribute('tabindex', 1)
    content.focus()
    content.removeAttribute('tabindex')
}

// Initalize navigation event listeners
toggleNavigation(true)

// Disable navigation
function toggleNavigation (isNavigationActive) {
    const navigationElem = document.querySelector('.sidebar-option.nav')

    if (isNavigationActive) {
        navigationElem.classList.remove('non-interactable')

        toggleLikedTracks(true)
        togglePlaylists(true)
        toggleSettings(true)
    } else {
        navigationElem.classList.add('non-interactable')

        toggleLikedTracks(false)
        togglePlaylists(false)
        toggleSettings(false)
    }
}

// Toggle Specified Navigation Buttons
function toggleLikedTracks(isButtonClickable) {
    const visitTracksButton = document.getElementById('visitTracks')

    if (isButtonClickable) {
        visitTracksButton.addEventListener('click', loadLikedTracks, false)
    } else {
        visitTracksButton.removeEventListener('click', loadLikedTracks, false)
    }
}

function togglePlaylists(isButtonClickable) {
    const visitPlaylistsButton = document.getElementById('visitPlaylists')

    if (isButtonClickable) {
        visitPlaylistsButton.addEventListener('click', loadPlaylists, false)
    } else {
        visitPlaylistsButton.removeEventListener('click', loadPlaylists, false)
    }
}

function toggleSettings(isButtonClickable) {
    const visitPlaylistsButton = document.getElementById('visitSettings')

    if (isButtonClickable) {
        visitPlaylistsButton.addEventListener('click', loadSettings, false)
    } else {
        visitPlaylistsButton.removeEventListener('click', loadSettings, false)
    }
}

// Load selected page
function loadLikedTracks () {
    const pageData = {
        currentPage: 'tracks'
    }

    // Reset track count
    indexCount = 0

    toggleNavigation(false)
    loadContent(pageData)
}

function loadPlaylists () {
    const pageData = {
        currentPage: 'playlists'
    }

    // Reset track count
    indexCount = 0

    toggleNavigation(false)
    loadContent(pageData)
}

function loadSettings () {
    const pageData = {
        currentPage: 'settings'
    }

    loadContent(pageData)
}

// Logout Event
const logoutButton = document.getElementById('logout')
logoutButton.addEventListener('click', logout)
