import { f, mb } from "../src/core-mappers";
import { MapperDefinition } from "../src/core-types";
import { OmitMethods } from "../src/util-types";

class InputClass {

  private _prop1: string = '';


  private _prop2: number = 42;

  constructor(prop1: string, prop2: number){
    this.prop1 = prop1;
    this.prop2 = prop2;
  }

  public get prop1(): string {
    return this._prop1;
  }

  public set prop1(val: string) {
    this._prop1 = val;
  }


  public get prop2(): number {
    return this._prop2;
  }

  public set prop2(val: number) {
    this._prop2 = val;
  }
}


class OutputClass {

  private _a: string = '';


  private _b: number = 5;

  public get a(): string {
    return this._a;
  }

  public set a(val: string) {
    this._a = val;
  }


  public get b(): number {
    return this._b;
  }

  public set b(val: number) {
    this._b = val;
  }


  public incrB(){
    this._b++;
  }
}


const mapperDef: MapperDefinition<InputClass, OmitMethods<OutputClass>> = {
  a: f('prop1'),
  b: f('prop2'),
}


describe('mapping classes', () => {

  it('map classes with factory', () => {

    const mapperDef: MapperDefinition<InputClass, OmitMethods<OutputClass>> = {
      a: f('prop1'),
      b: f('prop2'),
    }

    const mapper = mb(mapperDef, () => new OutputClass());

    const input = new InputClass('hello', 43);

    const expected = new OutputClass();
    expected.a = 'hello';
    expected.b = 43;

    const actual = mapper(input, {});
    
    expect(actual).toEqual(expected);
  });


  it('map classes without factory should fail', () => {

    const mapperDef: MapperDefinition<InputClass, OmitMethods<OutputClass>> = {
      a: f('prop1'),
      b: f('prop2'),
    }

    const mapper = mb(mapperDef);

    const input = new InputClass('hello', 43);

    const expected = new OutputClass();
    expected.a = 'hello';
    expected.b = 43;

    const actual = mapper(input, {});
    
    expect(actual).not.toEqual(expected);
  });
});