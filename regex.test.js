const {
  regexSearch,
  processPattern,
  operatorMap,
  searchByPattern,
} = require('./regex')

describe('test data', () => {
  test('can search for literal strings', () => {
    expect(regexSearch('dog', 'the dog ran around')).toEqual(['dog'])
    expect(regexSearch('cat', 'the cat snuck around')).toEqual(['cat'])
    expect(regexSearch('bird', 'the bird flew around')).toEqual(['bird'])
    expect(regexSearch('dog', 'the doog ran around')).toEqual([])
  })

  test('can use pipe operator to search for multiple strings', () => {
    expect(regexSearch('dog|cat', 'the dog ran around')).toEqual(['dog'])
    expect(regexSearch('dog|cat', 'the cat snuck around')).toEqual(['cat'])
    // Alternation results returned in order described in pattern.
    expect(regexSearch('dog|cat', 'the cat sat on the dog')).toEqual([
      'dog',
      'cat',
    ])
    expect(regexSearch('dog|cat', 'the bird flew around')).toEqual([])
  })
  test('can use modifiers', () => {
    expect(regexSearch('dog', 'A dog was found')).toEqual(['dog'])
    expect(regexSearch('do+g', 'I like dooogs')).toEqual(['dooog'])
    // expect(regexSearch('do*gs', 'I like dgs')).toEqual(['dgs'])
    expect(regexSearch('do+gs*', 'I like dooog')).toEqual(['dooog'])
    expect(regexSearch('do+gs*', 'I like dooogssss')).toEqual(['dooogssss'])
  })
  test('all together', () => {
    expect(regexSearch('do+g|ca+t', 'I like dooogs')).toEqual(['dooog'])
    expect(regexSearch('do+g|ca+t', 'I like caaats')).toEqual(['caaat'])
    expect(regexSearch('do+gs*|ca+ts*', 'I like dooogs')).toEqual(['dooogs'])
    expect(regexSearch('do+gs*|ca+ts*', 'I like caaats')).toEqual(['caaats'])
    expect(regexSearch('do+gs*|ca+ts*', 'I like caaatsss')).toEqual([
      'caaatsss',
    ])
    expect(regexSearch('do+gs*|ca+ts*', 'I like dooogs and caaatsss')).toEqual([
      'dooogs',
      'caaatsss',
    ])
    // expect(regexSearch('do+gs*|ca+ts*', 'I like caaatsss and dooogs')).toEqual([
    //   'dooogs',
    //   'caaatsss',
    // ])
    expect(regexSearch('dogs|cats', 'I like cats and dogs')).toEqual([
      'dogs',
      'cats',
    ])
  })
})

describe('unit tests', () => {
  describe('processPattern', () => {
    it('returns a single, literal operator if no modifiers', () => {
      expect(processPattern('dogs')).toEqual([
        { value: 'dogs', operator: 'literal' },
      ])
      expect(processPattern('cats')).toEqual([
        { value: 'cats', operator: 'literal' },
      ])
    })
    it('returns a modifier if used', () => {
      expect(processPattern('dogs+')).toEqual([
        { value: 'dog', operator: 'literal' },
        { value: 's', operator: '+' },
      ])
      expect(processPattern('cats*')).toEqual([
        { value: 'cat', operator: 'literal' },
        { value: 's', operator: '*' },
      ])
      expect(processPattern('dog+s')).toEqual([
        { value: 'do', operator: 'literal' },
        { value: 'g', operator: '+' },
        { value: 's', operator: 'literal' },
      ])
      expect(processPattern('do+gs*')).toEqual([
        { value: 'd', operator: 'literal' },
        { value: 'o', operator: '+' },
        { value: 'g', operator: 'literal' },
        { value: 's', operator: '*' },
      ])
    })
  })
  describe('operator literal', () => {
    const operator = operatorMap.literal

    it('finds matches and gives correct position', () => {
      expect(operator('dogs', 'dogs', 0)).toEqual({
        result: 'dogs',
        position: 4,
      })
      expect(operator('cats', 'cats are cool', 0)).toEqual({
        result: 'cats',
        position: 4,
      })
      expect(operator('birds', 'how cool are birds', 0)).toEqual({
        result: 'birds',
        position: 18,
      })
    })

    it('searches in middle of text', () => {
      expect(operator('dogs are cool', 'dogs', 4)).toEqual(null)
      expect(operator('cool', 'dogs are cool', 4)).toEqual({
        result: 'cool',
        position: 13,
      })
      expect(operator('bird', 'the bird flew', 4)).toEqual({
        result: 'bird',
        position: 8,
      })
    })
  })

  describe('operator +', () => {
    const operator = operatorMap['+']

    it('finds repeating characters', () => {
      expect(operator('o', 'ooo', 0)).toEqual({ result: 'ooo', position: 3 })
      expect(operator('o', 'dooog', 1)).toEqual({ result: 'ooo', position: 4 })
      expect(operator('o', 'dg', 0)).toEqual(null)
    })
  })

  describe('operator *', () => {
    const operator = operatorMap['*']

    it('finds repeating characters or none', () => {
      expect(operator('o', 'ooo', 0)).toEqual({ result: 'ooo', position: 3 })
      expect(operator('o', 'dooog', 1)).toEqual({ result: 'ooo', position: 4 })
      expect(operator('o', 'dg', 0)).toEqual({ result: '', position: 1 })
    })
  })

  describe('searchByPattern', () => {
    expect(searchByPattern('dog', 'dog')).toEqual('dog')
    expect(searchByPattern('dog', 'A dog was found')).toEqual('dog')
    expect(searchByPattern('do+g', 'I like dooogs')).toEqual('dooog')
    expect(searchByPattern('do*g', 'I like dooogs')).toEqual('dooog')
    expect(searchByPattern('do+gs*', 'I like dooog')).toEqual('dooog')
    expect(searchByPattern('do+gs*', 'I like dooogssss')).toEqual('dooogssss')
  })
})
