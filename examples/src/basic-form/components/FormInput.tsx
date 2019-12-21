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
