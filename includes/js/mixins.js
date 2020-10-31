// Check if null, undefined, or undefinedString
function isNil(comparison) {
    let isNull = comparison === null
    let isUndefined = comparison === undefined
    let isUndefinedString = comparison === 'undefined'

    if (isNull || isUndefined || isUndefinedString) {
        return true
    } else {
        return false
    }
}

function isNotNil(comparison) {
    let isNotNull = comparison !== null
    let isNotUndefined = comparison !== undefined
    let isNotUndefinedString = comparison !== 'undefined'

    if (isNotNull && isNotUndefined && isNotUndefinedString) {
        return true
    } else {
        return false
    }
}