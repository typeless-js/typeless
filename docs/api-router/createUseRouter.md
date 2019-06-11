---
id: createUseRouter
title: createUseRouter
hide_title: true
sidebar_label: createUseRouter
---



# createUseRouter(options)
Create a new router module.  

#### Arguments
1. `options: HistoryOptions` - the options:
    - `type: 'browser' | 'hash'` - use `browser` for html5 navigation, or use `hash` to keep routing after `#` in the url. Default `browser`.
#### Returns
`{Function}` - a React hook used to mount the module.


#### Example

```tsx
// router.ts
import { createUseRouter } from 'typeless-router';

const useRouter = createUseRouter();

// App.tsx
import { useRouter } from './router';

export function App() {
  // recommended to mount the module in the main component
  useRouter();

  return <div>...</div>
}