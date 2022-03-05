

type PickPropertyNames<T extends object> = {
  [K in keyof T]: T[K] extends (...arg: any) => any ? never: K
}[keyof T]


export type OmitMethods<T extends object> = Pick<T, PickPropertyNames<T>>; 