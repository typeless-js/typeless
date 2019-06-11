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
