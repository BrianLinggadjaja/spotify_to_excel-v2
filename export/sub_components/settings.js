function populateSettingsLayout () {
    const content = document.querySelector('.export-content')

    const settings = document.createElement('div')
    settings.classList.add('settings-wrapper')
    
    // Filename Input
    const fileName = document.createElement('div')
    fileName.classList.add('settings')
    const fileNameTitle = document.createElement('h2')
    fileNameTitle.innerText = 'File Name'
    const fileNameInput = document.createElement('input')
    fileNameInput.type = 'text'

    fileName.appendChild(fileNameTitle)
    fileName.appendChild(fileNameInput)

    // Toggle File Headers Checkbox
    const fileHeaders = document.createElement('div')
    fileHeaders.classList.add('settings')
    const fileHeadersTitle = document.createElement('h2')
    fileHeadersTitle.innerText = 'Enable File Headers?'
    const fileHeadersInput = document.createElement('input')
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

    addDragableInteractions('exportFormat')
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

function updateExportFormatInState (newExportFormat) {
    const settingsObj = getState('settings')
    settingsObj.exportFormat = newExportFormat

    setState('settings', settingsObj)
}