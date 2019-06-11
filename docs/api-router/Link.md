---
id: Link
title: Link
hide_title: true
sidebar_label: Link
---



# Link
A basic react component for navigation. It has exactly the same props as a native `<a />` component.

#### Example

```tsx
import { Link } from 'typeless-router';


export function Foo() {
  return (
    <div>
      <Link href="/foo" />
    </div>
  );
}