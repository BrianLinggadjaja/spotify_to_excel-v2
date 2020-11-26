// Checks if user is authorized already
document.addEventListener("DOMContentLoaded", checkAuth)

// Requests authorization via spotify redirect
const requestAuthButton = document.getElementById("requestAuth")

// Add event listener if auth button exists
if (requestAuthButton) {
	requestAuthButton.addEventListener("click", requestAuth)
}

// Request Authorization
function requestAuth() {
	const api = 'https://accounts.spotify.com/authorize'
	const responseType = '?response_type=' + 'token'
	const clientId = '&client_id=' + '3ed3180a3801467ab924cb03e2869ab1'
	const scope = '&scope=' + 'user-library-read playlist-read-private'
	let currentLocation = location.protocol + '//' + location.host + location.pathname
	const redirectUri = '&redirect_uri=' + currentLocation
	const randomKey = generateRandomKey(9)
	const sessionKey = '&state=' + randomKey

	// Store randomKey to match against state for later
	sessionStorage.sessionKey = randomKey

	// Route user to Spotify authentication service
	window.location.href = api + responseType + scope + clientId + redirectUri + sessionKey
}

function generateRandomKey(length) {
	let result = ''
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charactersLength = characters.length;

	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result;
}

// Check for user authorization
function checkAuth() {
	let isCurrentRouteAuth = matchRoute('auth')
	let isCurrentRouteExport = matchRoute('export')
	let sessionKey = sessionStorage.sessionKey
	let hasSessionKey = isNotNil(sessionKey)
	let authState = getState('auth')
	let hasAuthState = isNotNil(authState)
	let hasAuthToken = hasAuthState ? isNotNil(authState.accessToken) : false
	let isUserAuthorized = hasSessionKey && hasAuthToken
	let routeParams = new URLSearchParams(window.location.hash)
	let accessToken = routeParams.get('#access_token')
	let isAccessTokenInURL = isNotNil(accessToken)

	if (isCurrentRouteAuth && isUserAuthorized) {
		goToRoute('export')
	} else if (isCurrentRouteAuth && hasSessionKey && !hasAuthToken && isAccessTokenInURL) {
		storeAuthCredsToState()
		checkAuth()
	} else if (isCurrentRouteExport && !isUserAuthorized) {
		goToRoute('auth')
	}
}

// Store api authorization credentials & sessionKey into state
function storeAuthCredsToState() {
	let routeParams = new URLSearchParams(window.location.hash)
	let accessToken = routeParams.get('#access_token')
	let tokenType = routeParams.get('token_type')

	let authState = {
		accessToken: accessToken,
		tokenType: tokenType
	}

	setState('auth', authState)
}

function logout() {
	setState('auth', null)
	sessionStorage.removeItem('sessionKey')
	goToRoute('auth')
}
