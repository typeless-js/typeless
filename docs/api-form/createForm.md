---
id: createForm
title: createForm
hide_title: true
sidebar_label: createForm
---
 
# createForm(options)
Create a new form module.


#### Arguments
1. `options: FormOptions` - the options:
    - `symbol: Symbol` - the unique module symbol.
    - `validator: (errors, data) => void` - the validation function.
        - `data` represents form values entered by the user.
        - `errors` represents validation errors. A hash map where the key is a field name, and the value is an error message or null/undefined.

#### Returns
`[useFormModule, FormActions, getFormState, FormProvider]` - a tuple with 4 elements:
  - `useFormModule` a React hook to mount the form module.
  - `FormActions` action creators for this form module.
  - `getFormState` the state getter.
  - `FormProvider` a React context provider.

## Example


```tsx
// symbol.ts
export const ExampleSymbol = Symbol('example');
export const ExampleFormSymbol = Symbol('example-form');

// interface.ts
import { createModule } from 'typeless';
import { ExampleSymbol } from './symbol';

export const [handle] = createModule(ExampleSymbol);

// form.ts
import { createForm } from 'typeless-form';
import { ExampleFormSymbol } from './symbol';

interface ExampleForm {
  foo: string;
  bar: string;
}

export const [
  useExampleForm,
  ExampleFormActions,
  getExampleFormState,
  ExampleFormProvider,
] = createForm<ExampleForm>({
  symbol: ExampleFormSymbol,
  validator(errors, data) {
    if (!data.foo) {
      errors.foo = 'This field is required';
    }
    if (!data.bar) {
      errors.bar = 'This field is required';
    } else if (data.bar.length < 3) {
      errors.bar = 'Minimum 3 characters';
    }
  },
});

// module.tsx
import React from 'react';
import { useActions } from 'typeless';
import * as Rx from 'typeless/rx';
import { handle } from './interface';
import {
  useExampleForm,
  ExampleFormProvider,
  ExampleFormActions,
  getExampleFormState,
} from './form';
import { FormInput } from '../../components/FormInput';

handle.epic().on(ExampleFormActions.setSubmitSucceeded, () => {
  alert(JSON.stringify(getExampleFormState().values, null, 2));
  return Rx.empty();
});

export function ExampleModule() {
  handle();
  useExampleForm();

  const { submit } = useActions(ExampleFormActions);

  return (
    <ExampleFormProvider>
      <form
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        <FormInput name="foo" />
        <FormInput name="bar" />
        <button>submit</button>
      </form>
    </ExampleFormProvider>
  );
}
```

Example implementation for `FormInput`.  
It's recommended that you implement all controls for all primitives (inputs, selects, radio buttons).

```tsx
// ../components/FormInput.tsx
import React from 'react';
import { FormContext } from 'typeless-form';

interface FormInputProps {
  name: string;
}

export const FormInput = (props: FormInputProps) => {
  const { name, ...rest } = props;
  const data = React.useContext(FormContext);
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const hasError = data.touched[name] && !!data.errors[name];
  const value = data.values[name];
  return (
    <div style={{ marginBottom: 20 }}>
      <input
        value={value == null ? '' : value}
        onBlur={() => data.actions.blur(name)}
        onChange={e => {
          data.actions.change(name, e.target.value);
        }}
        {...rest}
      />
      {hasError && <div style={{ color: 'red' }}>{data.errors[name]}</div>}
    </div>
  );
};

```