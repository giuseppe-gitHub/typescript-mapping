import { FnMapper, MapperDefinition } from './core-types';


export function mb<Src extends object, Out extends object, C = any, OutFact extends Out = Out>(mapperDef: MapperDefinition<Src,Out,C>, outFactory?: (src: Src, ctx: C) => OutFact): FnMapper<Src, OutFact, C> {

  return (src, ctx) => {
    let out: OutFact;
    if(outFactory){
      out = outFactory(src, ctx);
    }else{
      out = {} as OutFact;
    }

    for(const key in mapperDef){
      const fn = mapperDef[key] as FnMapper<Src, any, any>;
      out[key] = fn(src, ctx);
    }

    return out;
  };
}

export const mapperBuilder = mb;




export function f<Src extends object, K extends keyof Src, C= any>( key: K): FnMapper<Src, Src[K], C> {
  return (src, _ctx) => src[key];
}

export const field = f;

export function map<Src, Out, C>( fnMapper: FnMapper<Src, Out, C>): FnMapper<Src[], Out[], C> {
  return (src, ctx) => {
    return src.map( el => fnMapper(el, ctx));
  };
}

export const arrayMap = map;
