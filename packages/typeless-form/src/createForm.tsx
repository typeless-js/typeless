import React from 'react';
import { createModule, useActions } from 'typeless';
import * as Rx from 'typeless/rx';
import { FormContext } from './FormContext';

type Validator<T> = (
  errors: { [x in keyof T]?: string },
  data: T
) => { [x in keyof T]?: string } | void;

interface FormOptions<T> {
  symbol: symbol;
  validator?: Validator<T>;
}

interface FormState<T> {
  values: T;
  errors: { [x in keyof T]?: string };
  touched: { [x in keyof T]?: boolean };
}

export function createForm<TData>(options: FormOptions<TData>) {
  const { symbol, validator } = options;

  const [handle, FormActions, getFormState] = createModule(symbol)
    .withActions({
      blur: (field: keyof TData) => ({ payload: { field } }),
      focus: (field: keyof TData) => ({ payload: { field } }),
      change: (field: keyof TData, value: TData[typeof field]) => ({
        payload: { field, value },
      }),
      changeMany: (values: Partial<TData>) => ({
        payload: { values },
      }),
      replace: (values: TData) => ({
        payload: { values },
      }),
      setErrors: (errors: { [x in keyof TData]?: string }) => ({
        payload: { errors },
      }),
      touchAll: null,
      submit: null,
      setSubmitSucceeded: null,
      setSubmitFailed: null,
      reset: null,
      resetTouched: null,
      validate: null,
    })
    .withState<FormState<TData>>();

  const initialState: FormState<TData> = {
    values: {} as TData,
    errors: {},
    touched: {},
  };

  handle
    .epic()
    .onMany(
      [
        FormActions.change,
        FormActions.blur,
        FormActions.changeMany,
        FormActions.replace,
        FormActions.validate,
      ],
      () => {
        if (!validator) {
          return Rx.empty();
        }
        const state = getFormState();
        const errors = {} as any;
        const ret = validator!(errors, state.values);
        return FormActions.setErrors(ret || errors);
      }
    )
    .on(FormActions.submit, (_, { action$ }) => {
      return Rx.concatObs(
        Rx.of(FormActions.validate()),
        action$.pipe(
          Rx.waitForType(FormActions.setErrors),
          Rx.map(() => {
            const state = getFormState();
            const anyError = Object.values(state.errors).some(x => !!x);
            return anyError
              ? FormActions.setSubmitFailed()
              : FormActions.setSubmitSucceeded();
          })
        ),
        Rx.of(FormActions.touchAll())
      );
    });

  handle
    .reducer(initialState)
    .on(FormActions.blur, (state, { field }) => {
      state.touched[field] = true;
    })
    .on(FormActions.change, (state, { field, value }) => {
      state.values[field] = value;
    })
    .on(FormActions.changeMany, (state, { values }) => {
      Object.assign({}, state.values, values);
    })
    .on(FormActions.replace, (state, { values }) => {
      state.values = values;
    })
    .on(FormActions.setErrors, (state, { errors }) => {
      state.errors = errors;
    })
    .on(FormActions.touchAll, state => {
      state.touched = Object.keys(state.errors).reduce(
        (ret, key) => {
          ret[key] = true;
          return ret;
        },
        {} as any
      );
    })
    .on(FormActions.resetTouched, state => {
      state.touched = {};
    })
    .on(FormActions.reset, () => {
      return initialState;
    });

  const useFormModule = () => handle();

  const FormProvider = (props: { children: React.ReactChild }) => {
    const { blur, change } = useActions(FormActions);
    const form = getFormState.useState();
    const { children } = props;
    const value = React.useMemo(
      () =>
        Object.assign({}, form, {
          actions: { blur, change },
        }),
      [form]
    );

    return (
      <FormContext.Provider value={value as any}>
        {children}
      </FormContext.Provider>
    );
  };
  return [useFormModule, FormActions, getFormState, FormProvider] as [
    typeof useFormModule,
    typeof FormActions,
    typeof getFormState,
    typeof FormProvider
  ];
}
