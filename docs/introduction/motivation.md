---
id: motivation
title: Motivation
hide_title: true
sidebar_label: Motivation
---

# Motivation

## Problems

Creating Redux applications in TypeScript can be overwhelming. Many developers face the same problems:

- **Too much boilerplate code**  
  Creating actions types, actions creators, defining RootAction and RootState types require a lot of typing!

- **Double annotation problem**  
  Many libraries work nice with JavaScript, but they are problematic with TypeScript.  
  When using [redux-saga](https://github.com/redux-saga/redux-saga) you can't infer types from `yield` statements, and you must add extra annotations to your code. It can cause potential bugs if you provide the wrong type.  
  The `connect` function must match exactly `props` of your connected component. Any small mistake causes a big compiler error if there are many properties. Fixing such mistakes is tedious and frustrating.

- **Too many libraries**  
  "What libraries should I use? redux-observables, redux-saga, redux-thunk, redux-xxx?"  
  Over-analyzing can cause [Analysis paralysis](https://en.wikipedia.org/wiki/Analysis_paralysis).

- **Lack of guidelines**  
  There are no official guidelines on how to lazy load reducers, sagas or epics. Code splitting is critical when scaling bigger apps.  
  Custom solutions for lazy loading usually don't work with HMR causing poor developer experience.

## Base Concepts

- **Designed for TypeScript**  
  All APIs are designed for TypeScript and type-safety:

  - TypeScript will boost your productivity, not slows you down.
  - Only the necessary annotations are required: state, action arguments.
  - No typecasting. Everything is inferred automatically. 95% of the code looks like pure JavaScript.
  - No RootAction, RootEpic, RootState or other helper types.

- **Provide all building blocks**  
  Typeless includes everything to build mid-sized or enterprise level apps.  
  You don't need to rely on multiple small libraries.

- **Modularity**  
  Proper modularity is critical for building scalable apps.  
  There is no need to create root files for epics, reducers, types, etc. Once you create a new module, you can attach it from any place. Similar to standard React components.

- **Opinionated**  
  All common use cases and problems are solved by default. No need to over-think how to fix trivial issues.  
  All recommendations and best practices are provided!
