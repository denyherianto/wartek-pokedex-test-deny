import leftPad from './leftPad'

describe('Number -> #leftPad', () => {
  it.each([
    [123, 4, '0123'],
    [1, 10, '0000000001'],
    [5, 1, '5'],
  ])('Should return expected value', (input1, input2, expected) => {
    expect(leftPad(input1, input2)).toEqual(expected)
  })
})
