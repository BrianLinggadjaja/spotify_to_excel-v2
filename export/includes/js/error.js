function openError (message, errorCode) {
    let errorHandlerHidden = document.querySelector('.error-wrapper.hidden')
    let isErrorHandlerClosed = isNotNil(errorHandlerHidden)
    
    // Store error code in state
    let metadata = getState('metadata')
    metadata.errorCode = errorCode
    setState('metadata', metadata)

    // Check if errorCode is a 400 type error (request re-auth from user)
    let isClientError = (errorCode >= 400 && errorCode < 500)
    if (isClientError) {
        // Clear Data & Visit Auth
        localStorage.clear()
        goToRoute('auth')
    } else if (isErrorHandlerClosed) {
        document.querySelector('.error-message').innerText = message
        errorHandlerHidden.setAttribute('aria-hidden', 'false')
        errorHandlerHidden.classList.remove('hidden')
    }
}

function closeError () {
    let errorHandler = document.querySelector('.error-wrapper')
    let errorHandlerHidden = document.querySelector('.error-wrapper.hidden')
    let isErrorHandlerOpen = isNil(errorHandlerHidden)

    if (isErrorHandlerOpen) {
        document.querySelector('.error-message').innerText = null
        errorHandler.setAttribute('aria-hidden', 'true')
        errorHandler.classList.add('hidden')
        
        // Clear Data & Visit Auth
        localStorage.clear()
        goToRoute('auth')
    }
}

// Event listener for close error handler button
const errorButton = document.getElementById('errorButton')
errorButton.addEventListener('click', () => {
    closeError()

    let metadata = getState('metadata')
    let errorCode = metadata.errorCode
    let isErrorAuthIssue = ((errorCode === 400) || (errorCode === 401))

    // If error is Authorization, re-request Auth
    if (isErrorAuthIssue) {
        // Reset error code
        metadata.errorCode = null
        setState('metadata', metadata)

        checkAuth()
    }
})