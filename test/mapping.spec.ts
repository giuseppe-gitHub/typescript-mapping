import { field, mb } from '../src/core-mappers'
import { MapperDefinition } from '../src/core-types'
import { pipe } from '../src/mapper-pipe'

interface InputType {
  x: number
  y: string
  innerInput: {
    first: number
    second: string
  }
}

interface OutputType {
  a: number
  b: string

  innerOutput: {
    one: number
    two: string
  }
}

describe('base-mapping', () => {
  it('base mapping', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: field('x'),
      b: field('y'),
      innerOutput: pipe(
        field('innerInput'),
        mb({
          one: field('first'),
          two: field('second'),
        })
      ),
    }

    const input: InputType = {
      x: 42,
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 42,
      b: 'ciao',
      innerOutput: {
        one: 1,
        two: 'second',
      },
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('mapping with transformer as postmapper', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: field('x'),
      b: field('y'),
      innerOutput: pipe(
        field('innerInput'),
        mb({
          one: field('first'),
          two: field('second'),
        }),
        (src) => {
          if (src.two === 'second') src.two = 'two'
          return src
        }
      ),
    }

    const input: InputType = {
      x: 42,
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 42,
      b: 'ciao',
      innerOutput: {
        one: 1,
        two: 'two',
      },
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('mapping with field pipe', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(field('innerInput'), field('first')),
      b: field('y'),
      innerOutput: pipe(
        field('innerInput'),
        mb({
          one: field('first'),
          two: field('second'),
        })
      ),
    }

    const input: InputType = {
      x: 42,
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 1,
      b: 'ciao',
      innerOutput: {
        one: 1,
        two: 'second',
      },
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('mapping with transformer', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(field('x'), (n) => n + 1),
      b: field('y'),
      innerOutput: pipe(
        field('innerInput'),
        mb({
          one: field('first'),
          two: field('second'),
        })
      ),
    }

    const input: InputType = {
      x: 42,
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 43,
      b: 'ciao',
      innerOutput: {
        one: 1,
        two: 'second',
      },
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })
})
