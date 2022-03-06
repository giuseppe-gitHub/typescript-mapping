import { FnMapper, MapperDefinition } from './core-types';

export type OutputFactory<Src, Out, C= any> = (src: Src, ctx: C) => Out;

export function mapperBuilder<Src extends object, Out extends object, C = any>(mapperDef: MapperDefinition<Src,Out,C>, outFactory?: OutputFactory<Src,Out, C>): FnMapper<Src, Out, C> {

  return (src, ctx) => {
    let out: Out;
    if(outFactory){
      out = outFactory(src, ctx);
    }else{
      out = {} as Out;
    }

    for(const key in mapperDef){
      const fn = mapperDef[key] as FnMapper<Src, any, any>;
      out[key] = fn(src, ctx);
    }

    return out;
  };
}

export const mb = mapperBuilder;




export function field<Src extends object, K extends keyof Src, C= any>( key: K): FnMapper<Src, Src[K], C> {
  return (src, _ctx) => src[key];
}

export const f = field;

export function arrayMap<Src, Out, C>( fnMapper: FnMapper<Src, Out, C>): FnMapper<Src[], Out[], C> {
  return (src, ctx) => {
    return src.map( el => fnMapper(el, ctx));
  };
}

export const map = arrayMap;


export function identity<Src, C>(): FnMapper<Src, Src, C> {
  return (src) => src;
}
