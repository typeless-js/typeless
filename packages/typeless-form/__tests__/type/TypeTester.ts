// tslint:disable-next-line: no-namespace
export declare namespace TT {
  export type Eq<A, B> = (<T>() => T extends A ? 1 : 2) extends <
    T
  >() => T extends B ? 1 : 2
    ? true
    : false;

  export function assert<_T extends true>(): void;
  export function assertNot<_T extends false>(): void;
  export function describe(name: string, cb: () => void): void;
  export function it(name: string, cb: () => void): void;
  export function test(name: string, cb: () => void): void;
}
