const defaultState = {
    auth: {
        accessToken: null,
        tokenType: null
    },
    metadata: {
        currentPage: null,
        errorCode: null
    },
    settings: {
        fileName: 'song_list',
        fileHeaders: true,
        exportFormat: ['index', 'name', 'artist', 'genre', 'album']

        /*
            index
            name
            artists[0].name
            getArtistGenre(tracks[i].track.artists[0].id)
            album.name
            custom
        */
    }
}

function setState(location, object) {
    let globalState = getGlobalState()
    let hasGlobalState = isNotNil(globalState)
    let hasLocalState = hasGlobalState ? isNotNil(globalState[location]) : false

    if (hasGlobalState && hasLocalState) {
        globalState[location] = object
        localStorage.setItem('state', JSON.stringify(globalState))
    } else {
        // If no state exists, load default state
        localStorage.state = JSON.stringify(defaultState)
        console.error('state.js > setState() > Invalid or null state request')
        goToRoute('auth')
    }
}

function getState(location) {
    let globalState = getGlobalState()
    let hasGlobalState = isNotNil(globalState)

    // Existance check for globalState before grabbing the localState
    if (hasGlobalState) {
        let state = globalState[location]
        let isRequestedStateNotEmpty = isNotNil(state)
        let stateIfExists = isRequestedStateNotEmpty ? state : null
        
        return stateIfExists
    } else {
        return null
    }
}


function getGlobalState() {
    let state = localStorage.state
    let hasState = isNotNil(state)

    if (hasState) {
        state = JSON.parse(state)
    } else {
        return null
    }

    return state
}
