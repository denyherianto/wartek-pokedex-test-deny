import slugToName from '@/utils/String/slugToName'

describe('String -> #slugToName', () => {
  it.each([
    ['test', 'TEST'],
    ['test-1234', 'TEST 1234'],
    ['type-name', 'TYPE NAME'],
  ])('Should return expected value', (input, expected) => {
    expect(slugToName(input)).toEqual(expected)
  })
})
