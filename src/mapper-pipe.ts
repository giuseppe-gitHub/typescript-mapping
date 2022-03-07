import { identity } from "./core-mappers";
import { FnMapper } from "./core-types";


export function pipe<Src, C>(): FnMapper<Src, Src , C>;
export function pipe<Src, Out, C>(mapper: FnMapper<Src, Out , C>): FnMapper<Src, Out , C>;
export function pipe<Src, Out1, Out2, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C> ) : FnMapper<Src, Out2 , C>;
export function pipe<Src, Out1, Out2, Out3, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C> ) : FnMapper<Src, Out3 , C>;
export function pipe<Src, Out1, Out2, Out3, Out4, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C>, fourth: FnMapper<Out3, Out4 , C> ) : FnMapper<Src, Out4, C>;
export function pipe<Src, Out1, Out2, Out3, Out4, Out5, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C>, fourth: FnMapper<Out3, Out4 , C>, fifth: FnMapper<Out4, Out5 , C> ) : FnMapper<Src, Out5, C>;
export function pipe<Src, Out1, Out2, Out3, Out4, Out5, Out6, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C>, fourth: FnMapper<Out3, Out4 , C>, fifth: FnMapper<Out4, Out5 , C>, sixth: FnMapper<Out5, Out6 , C> ) : FnMapper<Src, Out6, C>;
export function pipe(...fnMappers: Array<FnMapper<any, any, any>>): FnMapper<any,any, any> {
return restParamPipe(...fnMappers);
}

export function restParamPipe(...fnMappers: Array<FnMapper<any, any, any>>): FnMapper<any,any, any> {

  if(fnMappers.length === 0){
    return identity;
  }

  if(fnMappers.length === 1){
    return fnMappers[0];
  }

  return (src, ctx) => {
    return fnMappers.reduce((val, fn) => fn(val,ctx), src);
  };
}