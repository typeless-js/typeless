import React from 'react';

interface FormContextValue {
  actions: {
    blur: (field: string) => any;
    change: (field: string, value: any) => any;
  };
  errors: {
    [x: string]: string;
  };
  touched: {
    [x: string]: boolean;
  };
  values: {
    [x: string]: any;
  };
}

export const FormContext = React.createContext<FormContextValue>(null!);
