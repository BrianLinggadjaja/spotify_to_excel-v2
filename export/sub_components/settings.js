function populateSettingsLayout () {
    const content = document.querySelector('.export-content')

    const settings = document.createElement('div')
    settings.classList.add('settings-wrapper')
    
    // Filename Input
    const fileName = document.createElement('div')
    fileName.classList.add('settings')
    const fileNameTitle = document.createElement('h2')
    fileNameTitle.innerText = 'Default File Name'
    const fileNameInput = document.createElement('input')
    fileNameInput.classList.add('settings-file-name')
    fileNameInput.type = 'text'

    fileName.appendChild(fileNameTitle)
    fileName.appendChild(fileNameInput)

    // Toggle File Headers Checkbox
    const fileHeaders = document.createElement('div')
    fileHeaders.classList.add('settings')
    const fileHeadersTitle = document.createElement('h2')
    fileHeadersTitle.innerText = 'Enable File Headers?'
    const fileHeadersInput = document.createElement('input')
    fileHeadersInput.classList.add('settings-file-headers')
    fileHeadersInput.type = 'checkbox'

    fileHeaders.appendChild(fileHeadersTitle)
    fileHeaders.appendChild(fileHeadersInput)

    // Export Format List
    const exportFormat = document.createElement('div')
    exportFormat.classList.add('settings')
    const exportFormatTitle = document.createElement('h2')
    exportFormatTitle.innerText = 'Sort Export Format'
    const exportFormatDescription = document.createElement('p')
    exportFormatDescription.innerText = 'Drag each block into a new position to change the export format.'
    
    exportFormat.appendChild(exportFormatTitle)
    exportFormat.appendChild(exportFormatDescription)
    exportFormat.appendChild(generateExportFormatList('exportFormat'))

    // Append child nodes to settings
    settings.appendChild(fileName)
    settings.appendChild(fileHeaders)
    settings.appendChild(exportFormat)
    content.appendChild(settings)

    loadSettingsFromState()

    addFileNameInputInteraction()
    addFileHeaderInputInteraction()
    addDragableInteractions('exportFormat')
}

function loadSettingsFromState () {
    const settingsObj = getState('settings')

    // Update File Name from State
    document.querySelector('.settings-file-name').value = settingsObj.fileName

    // Check if File Headers Enabled from State
    if (settingsObj.fileName) {
        document.querySelector('.settings-file-headers').checked = true
    } else {
        document.querySelector('.settings-file-headers').checked = true
    }
}

function generateExportFormatList (id) {
    const exportFormatArray = getState('settings').exportFormat
    const exportFormatList = document.createElement('ul')
    exportFormatList.classList.add('settings-exportformat__list')
    exportFormatList.id = id

    for (const exportSetting of exportFormatArray) {
        const exportFormatListItem = document.createElement('li')
        exportFormatListItem.classList.add('settings-exportformat__list-item')
        exportFormatListItem.innerText = exportSetting
        exportFormatList.appendChild(exportFormatListItem)
    }

    return exportFormatList
}

function addFileNameInputInteraction () {
    const fileNameInput = document.querySelector('.settings-file-name')
    fileNameInput.addEventListener('keyup', updateFileNameInState)
}

function addFileHeaderInputInteraction () {
    const fileNameInput = document.querySelector('.settings-file-headers')
    fileNameInput.addEventListener('click', updateFileHeadersInState)
}

function addDragableInteractions (listElem) {
    const exportFormatElement = document.getElementById(listElem)
    Sortable.create(exportFormatElement, {
        onSort: () => {
            const listItems = document.querySelectorAll(`#${listElem} > li`)
            let newExportFormat = []

            for (const item of listItems) {
                newExportFormat.push(item.innerText)
            }

            updateExportFormatInState(newExportFormat)
        },
    })
}

function updateFileNameInState () {
    const settingsObj = getState('settings')
    const newFileName = document.querySelector('.settings-file-name').value

    settingsObj.fileName = newFileName

    setState('settings', settingsObj)
}

function updateFileHeadersInState () {
    const settingsObj = getState('settings')
    const isFileHeadersEnabled = document.querySelector('.settings-file-headers').checked

    settingsObj.fileHeaders = isFileHeadersEnabled

    setState('settings', settingsObj)
}

function updateExportFormatInState (newExportFormat) {
    const settingsObj = getState('settings')
    settingsObj.exportFormat = newExportFormat

    setState('settings', settingsObj)
}
