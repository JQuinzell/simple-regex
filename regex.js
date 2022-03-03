const operatorMap = {
  literal: (value, text, position) => {
    // console.log('literal', { value, text, position })
    let charactersFound = 0
    for (let i = position; i < text.length; i++) {
      const letter = text[i]
      // console.log({ letter, i, charactersFound })
      if (letter === value[charactersFound]) {
        charactersFound++
        // console.log('found character')
        if (charactersFound === value.length) {
          return { result: value, position: i + 1 }
        }
      } else charactersFound = 0
    }
    return null
  },
  '+': (value, text, position) => {
    let i = position
    while (text[i] === value) i++
    const numFound = i - position
    if (numFound > 0) return { result: value.repeat(numFound), position: i }
    else return null
  },
  '*': (value, text, position) => {
    let i = position
    while (text[i] === value) i++
    const numFound = i - position
    return {
      result: value.repeat(numFound),
      position: numFound === 0 ? position + 1 : i,
    }
  },
}

function processPattern(pattern) {
  const operators = []
  let currentLiteral = ''
  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i]
    // console.log({ letter, i, currentLiteral })
    if (operatorMap[letter]) {
      const modifierValue = pattern[i - 1]
      const literalOp = {
        operator: 'literal',
        value: currentLiteral.slice(0, currentLiteral.length - 1),
      }
      const modifierOp = {
        operator: letter,
        value: modifierValue,
      }
      operators.push(literalOp)
      operators.push(modifierOp)
      currentLiteral = ''
    } else {
      currentLiteral += letter
    }
  }
  // console.log('done', { currentLiteral })
  if (currentLiteral) {
    operators.push({
      operator: 'literal',
      value: currentLiteral,
    })
  }
  return operators
}

function searchByPattern(pattern, text) {
  const operators = processPattern(pattern)
  // console.log('searchByPattern', pattern, text)
  // console.log(operators)
  let currentPosition = 0
  const values = operators
    .map(({ operator, value }) => {
      // console.log({ operator, value })
      const opFn = operatorMap[operator]
      const result = opFn(value, text, currentPosition)
      // console.log({ result })
      if (result) currentPosition = result.position
      return result?.result
    })
    .filter((result) => typeof result === 'string')

  if (values.length < operators.length) return null
  else return values.join('')
}

function processAlernation(pattern, text) {
  const results = pattern
    .split('|')
    .map((subPattern) => searchByPattern(subPattern, text))
    .filter(Boolean)
  return results
}

/**
 * Search text for strings matching the pattern and returns an array of results
 * @param {string} pattern
 * @param {string} text
 * @returns {string[]}
 */
function regexSearch(pattern, text) {
  return processAlernation(pattern, text)
}

module.exports = {
  regexSearch,
  operatorMap,
  processPattern,
  processAlernation,
  searchByPattern,
}
