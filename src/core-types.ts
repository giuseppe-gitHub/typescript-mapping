
export type FnMapper<Src, PrOut, C = any> = (src: Src, ctx: C) => PrOut;


export type MapperDefinition<Src, Out extends object, C = any > = {
  [K in keyof Out] : FnMapper<Src,Out[K], C>
};
