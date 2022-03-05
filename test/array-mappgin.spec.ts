import { arrayObj, f, a, field, mb } from '../src/core-mappers'
import { MapperDefinition } from '../src/core-types'
import { pipe } from '../src/mapper-pipe'
import { arrayMap, map } from '../src/util-mappers'

interface InputTypeWithArray {
  x: number
  y: string
  arrayProp: {
    first: number
    second: string
  }[]
}

interface OutputTypeWithArray {
  a: number
  b: string

  arrayPropOut: {
    one: number
    two: string
  }[]
}

interface InputWithArray2 {
  arrayProp: string[]
}

interface OutputWithArray2 {
  outputArrayProp: number[]
}
describe('array-mapping', () => {
  it('array mapping', () => {
    const mapperType: MapperDefinition<InputTypeWithArray, OutputTypeWithArray> = {
      a: field('x'),
      b: field('y'),
      arrayPropOut: pipe(
        field('arrayProp'),
        arrayObj({
          one: field('first'),
          two: field('second'),
        })
      ),
    }

    const input: InputTypeWithArray = {
      x: 42,
      y: 'ciao',
      arrayProp: [
        {
          first: 34,
          second: '21',
        },
        {
          first: 35,
          second: '22',
        },
      ],
    }

    const expected: OutputTypeWithArray = {
      a: 42,
      b: 'ciao',
      arrayPropOut: [
        {
          one: 34,
          two: '21',
        },
        {
          one: 35,
          two: '22',
        },
      ],
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('array mapping with array transform', () => {
    const mapperType: MapperDefinition<InputTypeWithArray, OutputTypeWithArray> = {
      a: f('x'),
      b: f('y'),
      arrayPropOut: pipe(
        f('arrayProp'),
        a({
          one: field('first'),
          two: field('second'),
        }),
        map((src) => {
          src.one = src.one + 1
          return src
        })
      ),
    }

    const input: InputTypeWithArray = {
      x: 42,
      y: 'ciao',
      arrayProp: [
        {
          first: 34,
          second: '21',
        },
        {
          first: 57,
          second: '22',
        },
      ],
    }

    const expected: OutputTypeWithArray = {
      a: 42,
      b: 'ciao',
      arrayPropOut: [
        {
          one: 35,
          two: '21',
        },
        {
          one: 58,
          two: '22',
        },
      ],
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('array base type mapping', () => {
    const mapperType: MapperDefinition<InputWithArray2, OutputWithArray2> = {
      outputArrayProp: pipe(
        f('arrayProp'),
        map((src) => parseInt(src))
      ),
    }

    const mapper = mb(mapperType)

    const input: InputWithArray2 = {
      arrayProp: ['4', '8', '16', '23', '42'],
    }

    const expected: OutputWithArray2 = {
      outputArrayProp: [4, 8, 16, 23, 42],
    }

    const actual = mapper(input, {});
    expect(actual).toEqual(expected);
  })
})
