import { arrayMap, field, identity, mapperBuilder, OutputFactory } from './core-mappers'
import { FnMapper, MapperDefinition } from './core-types'
import { pipe } from './mapper-pipe'

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

export function nestedFields<Src, C>(): FnMapper<Src, Src, C>
export function nestedFields<Src extends object, K extends keyof Src, C = any>(key: K): FnMapper<Src, Src[K], C>
export function nestedFields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], C = any>(key1: K1, key2: K2): FnMapper<Src, Src[K1][K2], C>
export function nestedFields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], K3 extends keyof Src[K1][K2], C = any>(key1: K1, key2: K2, key3: K3): FnMapper<Src, Src[K1][K2][K3], C>
export function nestedFields<Src extends object, K1 extends keyof Src, K2 extends keyof Src[K1], K3 extends keyof Src[K1][K2], K4 extends keyof Src[K1][K2][K3], C = any>(
  key1: K1,
  key2: K2,
  key3: K3,
  key4: K4
): FnMapper<Src, Src[K1][K2][K3][K4], C>
export function nestedFields<
  Src extends object,
  K1 extends keyof Src,
  K2 extends keyof Src[K1],
  K3 extends keyof Src[K1][K2],
  K4 extends keyof Src[K1][K2][K3],
  K5 extends keyof Src[K1][K2][K3][K4],
  C = any
>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): FnMapper<Src, Src[K1][K2][K3][K4][K5], C>
export function nestedFields<
  Src extends object,
  K1 extends keyof Src,
  K2 extends keyof Src[K1],
  K3 extends keyof Src[K1][K2],
  K4 extends keyof Src[K1][K2][K3],
  K5 extends keyof Src[K1][K2][K3][K4],
  K6 extends keyof Src[K1][K2][K3][K4][K5],
  C = any
>(key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): FnMapper<Src, Src[K1][K2][K3][K4][K5][K6], C>

export function nestedFields(...keys: Array<string>): FnMapper<any, any, any> {
  if (keys.length === 0) {
    return identity
  }

  if (keys.length === 1) {
    return field<any, string>(keys[0])
  }

  const fieldMappers = keys.map((k) => field<any, string>(k))

  return (src, ctx) => {
    return fieldMappers.reduce((val, fn) => fn(val, ctx), src)
  }
}

export const nf = nestedFields

export function fieldSubObject<Src extends object, K extends keyof Src, Out extends object, C>(key: K, mapperDef: MapperDefinition<Src[K], Out, C>): FnMapper<Src, Out, C> {
  return pipe(field(key), mapperBuilder(mapperDef))
}

export const fo = fieldSubObject


type ExcNullUndef<T> = Exclude<T, undefined | null>


export function defaultValue<Src, C>(defaultVale: ExcNullUndef<Src>): FnMapper<Src | undefined, ExcNullUndef<Src>, C> {
  return (src) => (src ? src : defaultVale) as any
}

export function fieldDefaultValue<Src extends object, K extends keyof Src, C = any>(key: K, dv: ExcNullUndef<Src[K]>): FnMapper<Src, ExcNullUndef<Src[K]>, C> {
  return pipe(field(key), defaultValue(dv))
}

export const fd = fieldDefaultValue

type NesExclUnd1<T, K1 extends keyof ExcNullUndef<T>> = ExcNullUndef<ExcNullUndef<T>[K1]>

type NesExclUnd2<T, K1 extends keyof ExcNullUndef<T>, K2 extends keyof NesExclUnd1<T, K1>> = ExcNullUndef<NesExclUnd1<T, K1>[K2]>

type NesExclUnd3<T, K1 extends keyof ExcNullUndef<T>, K2 extends keyof NesExclUnd1<T, K1>, K3 extends keyof NesExclUnd2<T, K1, K2>> = ExcNullUndef<NesExclUnd2<T, K1, K2>[K3]>
type NesExclUnd4<T, K1 extends keyof ExcNullUndef<T>, K2 extends keyof NesExclUnd1<T, K1>, K3 extends keyof NesExclUnd2<T, K1, K2>, K4 extends keyof NesExclUnd3<T, K1, K2, K3>> = ExcNullUndef<
  NesExclUnd3<T, K1, K2, K3>[K4]
>

export function nestedFieldsDefault<Src, C>(dfValue: ExcNullUndef<Src>): FnMapper<Src, ExcNullUndef<Src>, C>
export function nestedFieldsDefault<Src extends object, K extends keyof ExcNullUndef<Src>, C = any>(dV: NesExclUnd1<Src, K>, key: K): FnMapper<Src, NesExclUnd1<Src, K>, C>
export function nestedFieldsDefault<Src extends object, K1 extends keyof ExcNullUndef<Src>, K2 extends keyof NesExclUnd1<Src, K1>, C = any>(
  dV: NesExclUnd2<Src, K1, K2>,
  key1: K1,
  key2: K2
): FnMapper<Src, NesExclUnd2<Src, K1, K2>, C>
export function nestedFieldsDefault<Src extends object, K1 extends keyof ExcNullUndef<Src>, K2 extends keyof NesExclUnd1<Src, K1>, K3 extends keyof NesExclUnd2<Src, K1, K2>, C = any>(
  dV: NesExclUnd3<Src, K1, K2, K3>,
  key1: K1,
  key2: K2,
  key3: K3
): FnMapper<Src, NesExclUnd3<Src, K1, K2, K3>, C>
export function nestedFieldsDefault<
  Src extends object,
  K1 extends keyof ExcNullUndef<Src>,
  K2 extends keyof NesExclUnd1<Src, K1>,
  K3 extends keyof NesExclUnd2<Src, K1, K2>,
  K4 extends keyof NesExclUnd3<Src, K1, K2, K3>,
  C = any
>(dV: NesExclUnd4<Src, K1, K2, K3, K4>, key1: K1, key2: K2, key3: K3, key4: K4): FnMapper<Src, NesExclUnd4<Src, K1, K2, K3, K4>, C>
export function nestedFieldsDefault(dfValue: any, ...keys: Array<string>): FnMapper<any, any, any> {
  if (keys.length === 0) {
    return defaultValue(dfValue)
  }

  if (keys.length === 1) {
    return fieldDefaultValue(dfValue, keys[0])
  }

  const fieldMappers = keys.map((k) => field<any, string>(k))

  return (src, ctx) => {
    const res = fieldMappers.reduce(
      (val, fn) => {
        if (val.continue) {
          val.src = fn(val.src, ctx)
          if (!val.src) {
            val.src = dfValue
            val.continue = false
          }
        }
        return val
      },
      { src, continue: true }
    )
    return res.src;
  }
}

export const nfd = nestedFieldsDefault
