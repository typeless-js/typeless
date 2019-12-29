declare var require: <T = any>(path: string) => T;

// for parcel's hot module replacement method
declare var module: { hot?: { accept(cb: () => void) } };
