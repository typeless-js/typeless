# typeless

Typescript + React Hooks + RxJS = 😻


[![Build Status](https://travis-ci.org/typeless-js/typeless.svg?branch=master)](https://travis-ci.org/typeless-js/typeless) [![npm module](https://badge.fury.io/js/typeless.svg)](https://www.npmjs.org/package/typeless)

## Installation
Required peer dependencies: `react@^16.8` and `rxjs^@6`

```bash
npm i typeless
yarn add typeless
```

## Why Typeless?
Creating scalable React apps with Typescript can be painful. There are many small libraries that can be combined, but none of them provide a complete solution for building complex applications.  
`typeless` provide all building blocks: actions creators, reducers, epics with a minimal overhead of type annotation.  


## Features
- Designed for Typescript and type safety. Only minimal type annotations are required, all types are inferred where possible.
- Simple and developer friendly syntax with React hooks.
- Event-driven architecture using RxJS.
- Reducers and epics are loaded dynamically in React components. There is no single `reducers.ts` or `epics.ts` file.
- Code splitting for reducers and epics work out of the box.
- HMR works out of the box.


## Quick start
[https://typeless.js.org/introduction/quick-start](https://typeless.js.org/introduction/quick-start)



## License
MIT