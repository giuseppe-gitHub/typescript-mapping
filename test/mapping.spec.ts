import { mb } from '../src/core-mappers'
import { MapperDefinition } from '../src/core-types'
import { pipe } from '../src/mapper-pipe'
import { c, endo, fu, fo, f, tap, fields, d } from '../src/util-mappers'

interface InnerInputType {
  first: number
  second: string
}
interface InputType {
  x?: number
  y: string
  innerInput: InnerInputType
}

interface InnerOutputType {
  one: number
  two: string
}

interface OutputType {
  a: number
  b: string

  innerOutput: InnerOutputType
}

interface NestedInputType {
  a: {
    b: {
      c: {
        d: {
          e: {
            f: string
          }
        }
      }
    }
  }
}

interface NestedInputTypeWithUndef {
  a: {
    b: {
      c?: {
        d: string;
      }
    }
  }
  otherProp: number;
}


interface UnNestedOutputTYpe {
  prop: string
}

interface OutputWIthUndefined {
  propUndef?: string;
}

interface UnNestedOutputTYpe2 {
  prop: string
  otherProp: number
}

interface ShallowNestInput {
  a?: {
    b: string
  }
}

describe('base-mapping', () => {
  it('base mapping', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(f('x'), d(101)),
      b: fields('y'),
      innerOutput: pipe(
        fields('innerInput'),
        mb({
          one: fields('first'),
          two: fields('second'),
        })
      ),
    }

    const input: InputType = {
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 101,
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
      a: pipe(f('x'),  d(34)),
      b: f('y'),
      innerOutput: pipe(
        f('innerInput'),
        mb({
          one: f('first'),
          two: f('second'),
        }),
        endo((src) => {
          if (src.two === 'second') src.two = 'two'
          return src
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
        two: 'two',
      },
    }

    const mapper = mb(mapperType)
    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })


  it('mapping with nfd used as fd', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(fu('x'), d(34)),
      b: f('y'),
      innerOutput: pipe(
        f('innerInput'),
        mb({
          one: f('first'),
          two: f('second'),
        })
      ),
    }

    const input: InputType = {
      y: 'ciao',
      innerInput: {
        first: 1,
        second: 'second',
      },
    }

    const expected: OutputType = {
      a: 34,
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


  it('mapping with field pipe', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(f('innerInput'), f('first')),
      b: f('y'),
      innerOutput: pipe(
        f('innerInput'),
        mb({
          one: f('first'),
          two: f('second'),
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

  it('mapping with transformer and fieldSubObject', () => {
    const mapperType: MapperDefinition<InputType, OutputType> = {
      a: pipe(fu('x'), d(101), (n) => n + 1),
      b: f('y'),
      innerOutput: fo('innerInput', {
        one: f('first'),
        two: f('second'),
      }),
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

  it('nestedFields should work', () => {
    const mapperDef: MapperDefinition<NestedInputType, UnNestedOutputTYpe> = {
      prop: f('a', 'b', 'c', 'd', 'e', 'f'),
    }

    const input: NestedInputType = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'value',
              },
            },
          },
        },
      },
    }

    const expected: UnNestedOutputTYpe = {
      prop: 'value',
    }

    const mapper = mb(mapperDef)

    const actual = mapper(input, {})

    expect(actual).toEqual(expected)
  })

  it('nestedFields pipe with field should work', () => {
    const mapperDef: MapperDefinition<NestedInputType, UnNestedOutputTYpe> = {
      prop: pipe(
        f('a', 'b', 'c', 'd', 'e'),
        f('f'),
        tap((_src, ctx) => {
          ctx.val = 42
        })
      ),
    }

    const input: NestedInputType = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'value',
              },
            },
          },
        },
      },
    }

    const expected: UnNestedOutputTYpe = {
      prop: 'value',
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

    expect(ctx.val).toBe(42)
  })

  it('nestedFieldsDefaultValue should work', () => {
    const mapperDef: MapperDefinition<ShallowNestInput, UnNestedOutputTYpe> = {
      prop: pipe(fu('a', 'b'), d('dfValue')),
    }

    const input: ShallowNestInput = {
      a: {
        b: 'realValue',
      },
    }

    const expected: UnNestedOutputTYpe = {
      prop: 'realValue',
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })
  it('nestedFieldsDefaultValue with default should work', () => {
    const mapperDef: MapperDefinition<ShallowNestInput, UnNestedOutputTYpe> = {
      prop: pipe(fu('a', 'b'), d('dValue')),
    }

    const input: ShallowNestInput = {
    }

    const expected: UnNestedOutputTYpe = {
      prop: 'dValue',
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })

  it('nestedFieldsDefaultValue with default should work more nested', () => {
    const mapperDef: MapperDefinition<NestedInputTypeWithUndef, UnNestedOutputTYpe2> = {
      prop: pipe(fu( 'a', 'b', 'c', 'd'), d('dfVal')),
      otherProp: f('otherProp')
    }

    const input: NestedInputTypeWithUndef = {
      a: {
        b: {
          c: {
            d: 'realVal'
          }
        }
      },
      otherProp: 43
    }

    const expected: UnNestedOutputTYpe2 = {
      prop: 'realVal',
      otherProp: 43
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })

  it('nestedFieldsDefaultValue with default should work more nested using default', () => {
    const mapperDef: MapperDefinition<NestedInputTypeWithUndef, UnNestedOutputTYpe2> = {
      prop: pipe(fu( 'a', 'b', 'c', 'd'), d('dfVal')),
      otherProp: c(343),
    }

    const input: NestedInputTypeWithUndef = {
      a: {
        b: {}
      },
      otherProp: 43
    }

    const expected: UnNestedOutputTYpe2 = {
      prop: 'dfVal',
      otherProp: 343
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })

  it('undefined output prop should result undefined', () => {
    const mapperDef: MapperDefinition<NestedInputTypeWithUndef, OutputWIthUndefined> = {
      propUndef: fu('a', 'b', 'c', 'd')
    }

    const input: NestedInputTypeWithUndef = {
      a: {
        b: {}
      },
      otherProp: 43
    }

    const expected: OutputWIthUndefined = {
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })


  it('undefined output prop should have value', () => {
    const mapperDef: MapperDefinition<NestedInputTypeWithUndef, OutputWIthUndefined> = {
      propUndef: pipe(f('a', 'b'),fu('c','d'))
    }

    const input: NestedInputTypeWithUndef = {
      a: {
        b: {
          c: {
            d: 'ciao'
          }
        }
      },
      otherProp: 43
    }

    const expected: OutputWIthUndefined = {
      propUndef: 'ciao'
    }

    const mapper = mb(mapperDef)

    const ctx: any = {}
    const actual = mapper(input, ctx)

    expect(actual).toEqual(expected)

  })
})
