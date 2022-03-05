import { FnMapper } from "./core-types";



export function pipe<Src, Out1, Out2, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C> ) : FnMapper<Src, Out2 , C>;
export function pipe<Src, Out1, Out2, Out3, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C> ) : FnMapper<Src, Out3 , C>;
export function pipe<Src, Out1, Out2, Out3, Out4, C = any> ( first: FnMapper<Src, Out1 , C>, second: FnMapper<Out1, Out2 , C>, third: FnMapper<Out2, Out3 , C>, fourth: FnMapper<Out3, Out4 , C> ) : FnMapper<Src, Out4, C>;

export function pipe(...fnMappers: Array<FnMapper<any, any, any>>): FnMapper<any,any, any> {
  if(fnMappers.length < 2){
    const error = new Error('missing mappers');
    error.name = 'MissingPipeMappersError';
    throw error;
  }

  return (src, ctx) => {
    return fnMappers.reduce((val, fn) => fn(val,ctx), src);
  };
}