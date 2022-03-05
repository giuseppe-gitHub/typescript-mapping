import { arrayMap, mapperBuilder } from "./core-mappers";
import { FnMapper, MapperDefinition } from "./core-types";


export function a<Src extends object, Out extends object, C= any>(mapperDef: MapperDefinition<Src,Out,C>): FnMapper<Src[],Out[], C> {
  const mapper = mapperBuilder(mapperDef);
  return arrayMap(mapper);
}

export const arrayObj = a;