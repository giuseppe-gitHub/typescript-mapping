import { arrayMap, mapperBuilder, OutputFactory } from './core-mappers'
import { FnMapper, MapperDefinition } from './core-types'
import { pipe, restParamPipe } from './mapper-pipe'

export function arrayObj<Src extends object, Out extends object, C = any>(mapperDef: MapperDefinition<Src, Out, C>, outFactory?: OutputFactory<Src, Out, C>): FnMapper<Src[], Out[], C> {
  const mapper = mapperBuilder(mapperDef, outFactory)
  return arrayMap(mapper)
}

export const a = arrayObj

export function endomorphism<Src, C = any>(mapper: FnMapper<Src, Src, C>): FnMapper<Src, Src, C> {
  return mapper
}

export const endo = endomorphism

export function tap<Src, C = any>(mapper: (src: Src, ctx: C) => void): FnMapper<Src, Src, C> {
  return (src, ctx) => {
    mapper(src, ctx)
    return src
  }
}

export function constant<Src, Out, C = any>(out: Out): FnMapper<Src, Out, C> {
  return () => out
}

export const c = constant

function utilField<Src extends object, K extends keyof Src, C = any>(key: K): FnMapper<Src, Src[K], C> {
  return (src, _ctx) => src[key]
}

export function fields<Src, C>(): FnMapper<Src, Src, C>
export function fields<Src extends object, K extends keyof Src, C = any>(key: K): FnMapper<Src, Src[K], C>
export function fields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], C = any>(key1: K1, key2: K2): FnMapper<Src, Src[K1][K2], C>
export function fields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], K3 extends keyof Src[K1][K2], C = any>(key1: K1, key2: K2, key3: K3): FnMapper<Src, Src[K1][K2][K3], C>
export function fields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], K3 extends keyof Src[K1][K2], K4 extends keyof Src[K1][K2][K3], C = any>(
  key1: K1,
  key2: K2,
  key3: K3,
  key4: K4
): FnMapper<Src, Src[K1][K2][K3][K4], C>
export function fields<
  Src extends object,
  K1 extends keyof Src,
  K2 extends keyof Src[K1],
  K3 extends keyof Src[K1][K2],
  K4 extends keyof Src[K1][K2][K3],
  K5 extends keyof Src[K1][K2][K3][K4],
  C = any
>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): FnMapper<Src, Src[K1][K2][K3][K4][K5], C>
export function fields<
  Src extends object,
  K1 extends keyof Src,
  K2 extends keyof Src[K1],
  K3 extends keyof Src[K1][K2],
  K4 extends keyof Src[K1][K2][K3],
  K5 extends keyof Src[K1][K2][K3][K4],
  K6 extends keyof Src[K1][K2][K3][K4][K5],
  C = any
>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): FnMapper<Src, Src[K1][K2][K3][K4][K5][K6], C>

export function fields(...keys: Array<string>): FnMapper<any, any, any> {
  const fieldMappers = keys.map((k) => utilField<any, string>(k))

  return restParamPipe(...fieldMappers)
}

export const f = fields

export function fieldSubObject<Src extends object, K extends keyof Src, Out extends object, C>(key: K, mapperDef: MapperDefinition<Src[K], Out, C>): FnMapper<Src, Out, C> {
  return pipe(fields(key), mapperBuilder(mapperDef))
}

export const fo = fieldSubObject


export function defaultValue<Src, C>(defaultVale: NonNullable<Src>): FnMapper<Src | undefined, NonNullable<Src>, C> {
  return (src) => (src ?? defaultVale)
}

export const d = defaultValue;

type NesExclUnd1<T, K1 extends keyof NonNullable<T>> = NonNullable<NonNullable<T>[K1]>

type NesExclUnd2<T, K1 extends keyof NonNullable<T>, K2 extends keyof NesExclUnd1<T, K1>> = NonNullable<NesExclUnd1<T, K1>[K2]>

type NesExclUnd3<T, K1 extends keyof NonNullable<T>, K2 extends keyof NesExclUnd1<T, K1>, K3 extends keyof NesExclUnd2<T, K1, K2>> = NonNullable<NesExclUnd2<T, K1, K2>[K3]>
type NesExclUnd4<T, K1 extends keyof NonNullable<T>, K2 extends keyof NesExclUnd1<T, K1>, K3 extends keyof NesExclUnd2<T, K1, K2>, K4 extends keyof NesExclUnd3<T, K1, K2, K3>> = NonNullable<
  NesExclUnd3<T, K1, K2, K3>[K4]
>

export function fieldsUndefined<Src, C>(): FnMapper<Src, Src, C>
export function fieldsUndefined<Src extends object, K extends keyof NonNullable<Src>, C = any>(key: K): FnMapper<Src, NesExclUnd1<Src, K> | undefined, C>
export function fieldsUndefined<Src extends object, K1 extends keyof NonNullable<Src>, K2 extends keyof NesExclUnd1<Src, K1>, C = any>(key1: K1, key2: K2): FnMapper<Src, NesExclUnd2<Src,K1, K2> | undefined, C>
export function fieldsUndefined<Src extends object, K1 extends keyof NonNullable<Src>, K2 extends keyof NesExclUnd1<Src, K1>, K3 extends keyof NesExclUnd2<Src, K1, K2>, C = any>(
  key1: K1,
  key2: K2,
  key3: K3
): FnMapper<Src, NesExclUnd3<Src, K1, K2, K3> | undefined, C>
export function fieldsUndefined<
  Src extends object,
  K1 extends keyof NonNullable<Src>,
  K2 extends keyof NesExclUnd1<Src, K1>,
  K3 extends keyof NesExclUnd2<Src, K1, K2>,
  K4 extends keyof NesExclUnd3<Src, K1, K2, K3>,
  C = any
>(key1: K1, key2: K2, key3: K3, key4: K4): FnMapper<Src, NesExclUnd4<Src, K1, K2, K3, K4> | undefined, C>
export function fieldsUndefined(...keys: Array<string>): FnMapper<any, any, any> {
  const fieldMappers = keys.map((k) => innerFIeldDefaultValueHelper<any, string>(k))

  return restParamPipe(restParamPipe(...fieldMappers))
}

export const fu = fieldsUndefined

function innerFIeldDefaultValueHelper<Src, K extends keyof Src, C = any>(key: K): FnMapper<Src, Src[K] | undefined, C> {
  return (src) => {
    if (!src) return undefined
    return src[key]
  }
}
