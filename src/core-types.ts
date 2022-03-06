
export type FnMapper<Src, Out, C = any> = (src: Src, ctx: C) => Out;

export type MapperDefinition<Src, Out extends object, C = any > = {
  [K in keyof Out] : FnMapper<Src,Out[K], C>
};
