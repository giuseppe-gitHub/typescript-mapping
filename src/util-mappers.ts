import { arrayMap, mapperBuilder, OutputFactory } from "./core-mappers";
import { FnMapper, MapperDefinition } from "./core-types";


export function a<Src extends object, Out extends object, C= any >(mapperDef: MapperDefinition<Src,Out,C>, outFactory?: OutputFactory<Src, Out, C>): FnMapper<Src[],Out[], C> {
  const mapper = mapperBuilder(mapperDef, outFactory);
  return arrayMap(mapper);
}

export const arrayObj = a;


export function transform<Src, C = any>(mapper: FnMapper<Src,Src, C> ): FnMapper<Src,Src, C> {
  return mapper;
}