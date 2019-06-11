---
id: getRouterState
title: getRouterState
hide_title: true
sidebar_label: getRouterState
---



# getRouterState
A getter for router state.



## Types

```ts
interface RouterLocation {
  pathname: string;
  search: string;
  type: 'push' | 'replace';
}

interface RouterState {
  location: RouterLocation | null;
  prevLocation: RouterLocation | null;
}
```