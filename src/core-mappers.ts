import { FnMapper, MapperDefinition } from './core-types';


export function mb<Src extends object, Out extends object, C = any>(mapperDef: MapperDefinition<Src,Out,C>): FnMapper<Src, Out, C> {

  return (src, ctx) => {
    const out: Partial<Out> = {};

    let key: keyof Out;
    for(key in mapperDef){
      const fn = mapperDef[key] as FnMapper<Src, any, any>;
      const propOut = fn(src, ctx);
      out[key] = propOut;
    }

    return out as Out;
  };
}

export const mapperBuilder = mb;




export function f<Src extends object, K extends keyof Src, C= any>( key: K): FnMapper<Src, Src[K], C> {
  return (src, _ctx) => src[key];
}

export const field = f;

export function a<Src extends object, Out extends object, C= any>(mapperDef: MapperDefinition<Src,Out,C>): FnMapper<Src[],Out[], C> {
  const mapper = mapperBuilder(mapperDef);
  return (src, ctx) => {
    return src.map( el => mapper(el, ctx));
  };
}

export const arrayObj = a;