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
    if (isNavigationActive) {
        toggleLikedTracks(true)
        togglePlaylists(true)
    } else {
        toggleLikedTracks(false)
        togglePlaylists(false)
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

// Load selected page
function loadLikedTracks () {
    const pageData = {
        currentPage: 'tracks'
    }

    // Reset track count
    indexCount = 0

    loadContent(pageData)
}

function loadPlaylists () {
    const pageData = {
        currentPage: 'playlists'
    }

    // Reset track count
    indexCount = 0

    loadContent(pageData)
}

// Logout Event
const logoutButton = document.getElementById('logout')
logoutButton.addEventListener('click', logout)
