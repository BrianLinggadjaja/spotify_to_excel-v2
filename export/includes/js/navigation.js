// Run skipNavigation when pressed "enter" on the Skip Nav button
const skipNavigationButton = document.getElementById('skipNav')
skipNavigationButton.addEventListener('click', skipNavigation)

function skipNavigation() {
    const content = document.querySelector('main')
    console.log('test')
    content.setAttribute('tabindex', 1)
    content.focus()
    content.removeAttribute('tabindex')
}

// Event Handlers
const visitTracksButton = document.getElementById('visitTracks')
visitTracksButton.addEventListener('click', () => {
    const pageData = {
        currentPage: 'tracks',
    }

    loadContent(pageData)
})

const visitPlaylistsButton = document.getElementById('visitPlaylists')
visitPlaylistsButton.addEventListener('click', () => {
    const pageData = {
        currentPage: 'playlists',
    }

    loadContent(pageData)
})

const logoutButton = document.getElementById('logout')
logoutButton.addEventListener('click', () => {
    logout()
})