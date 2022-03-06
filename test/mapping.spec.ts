import { f, field, mb } from '../src/core-mappers'
import { MapperDefinition } from '../src/core-types'
import { pipe } from '../src/mapper-pipe'
import { nf, tap, transform } from '../src/util-mappers'

interface InnerInputType {
  first: number
  second: string
}
interface InputType {
  x: number
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
            f: string;
          }
        }
      }
    }
  }
}

interface UnNestedOutputTYpe {
  prop: string;
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
        transform((src) => {
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

  it('nestedFields should work', () => {
    const mapperDef: MapperDefinition<NestedInputType, UnNestedOutputTYpe> = {
      prop: nf('a', 'b', 'c', 'd', 'e', 'f')
    };

    const input: NestedInputType = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'value'
              }
            }
          }
        }
      }
    };

    const expected: UnNestedOutputTYpe = {
      prop: 'value'
    };

    const mapper = mb(mapperDef);

    const actual = mapper(input, {});

    expect(actual).toEqual(expected);

  })

  it('nestedFields pipe with field should work', () => {
    const mapperDef: MapperDefinition<NestedInputType, UnNestedOutputTYpe> = {
      prop: pipe(nf('a', 'b', 'c', 'd', 'e'), f('f'), tap((_src, ctx) => {
        ctx.val = 42;
      }))
    };

    const input: NestedInputType = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: 'value'
              }
            }
          }
        }
      }
    };

    const expected: UnNestedOutputTYpe = {
      prop: 'value'
    };

    const mapper = mb(mapperDef);

    const ctx: any = {};
    const actual = mapper(input, ctx);

    expect(actual).toEqual(expected);

    expect(ctx.val).toBe(42);

  })
})
