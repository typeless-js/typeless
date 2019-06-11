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
