// List of routes
const routes = {
    auth: '/', // Based off root of application host
    export: '/export/'
}

function goToRoute(location) {
    let isNextRouteValid = validateRoute(location)

    if (isNextRouteValid) {
        window.location.href = routes[location]
    } else {
        console.error('routes.js > goToRoute() > Route requested is Invalid!')
    }
}

function validateRoute (location) {
    let isRouteValid = isNotNil(routes[location])

    return isRouteValid
}

// Checks if the currentRoute matches a known route
function matchRoute(knownRoute) {
    let isRouteValid = validateRoute(knownRoute)
    let currentRoute = window.location.pathname
    let isRouteMatching = currentRoute === routes[knownRoute]

    if (isRouteValid && isRouteMatching) {
        return true
    } else {
        return false
    }
}


