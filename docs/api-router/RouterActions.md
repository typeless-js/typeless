---
id: RouterActions
title: RouterActions
hide_title: true
sidebar_label: RouterActions
---



# RouterActions
The actions creators for router module.

## Actions
1. `$mounted` typeless lifecycle method
2. `$unmounted` typeless lifecycle method
3. `dispose` dispatch this action to stop listening for history API changes. Can be useful in unit testing.
4. `locationChange: (location: RouterLocation)` dispatched by router module after location changed.
5. `push: (location: LocationChange)` dispatch this action to change the location, and add a new entry to the stack.
6. `replace: (location: LocationChange)` similar to `push`, but it doesn't add a new entry to the stack.



## Types
```ts
type LocationChange =
  | string
  | {
      pathname: string;
      search?: string;
    };

interface RouterLocation {
  pathname: string;
  search: string;
  type: 'push' | 'replace';
}
```