import {  map, mb } from '../src/core-mappers';
import { MapperDefinition } from '../src/core-types';
import { pipe } from '../src/mapper-pipe';
import { arrayObj, a, f, fields } from '../src/util-mappers';

interface InnerInputType {
  first: number
  second: string
}

interface InputTypeWithArray {
  x: number
  y: string
  arrayProp: InnerInputType[]
}

interface InnerOutputType {
  one: number
  two: string
}

interface OutputTypeWithArray {
  a: number
  b: string

  arrayPropOut: InnerOutputType[]
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
      a: f('x'),
      b: fields('y'),
      arrayPropOut: pipe(
        fields('arrayProp'),
        arrayObj({
          one: fields('first'),
          two: fields('second'),
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
          one: fields('first'),
          two: fields('second'),
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
