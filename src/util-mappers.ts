import { FnMapper } from "./core-types";

export function arrayField<Src, Out, C>( fnMapper: FnMapper<Src, Out, C>): FnMapper<Src[], Out[], C> {
  return (src, ctx) => {
    return src.map( el => fnMapper(el, ctx));
  };
}