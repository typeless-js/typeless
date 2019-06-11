---
id: FormActions
title: FormActions
hide_title: true
sidebar_label: FormActions
---



# FormActions
The actions creators for form module.

## Actions
#### Your application can dispatch below actions.
1. `blur: (field: string)` mark field as touched
2. `change: (field: string, value: any)` update the field value
3. `changeMany: (values: object)` update multiple values, if a field is not defined in`values` it won't be set to undefined
4. `replace: (values: object)` replace all values with the provided values
5. `touchAll` mark all fields as touched
6. `submit` validate data and trigger setSubmitFailed/setSubmitSucceeded
7. `reset` reset the module, clear values, errors and touched status
8. `resetTouched` reset touched status

#### Your application should not dispatch below actions, they are used only internally.
1. `setErrors: (errors: object)` set validation errors (result from `validate` function)
2. `setSubmitSucceeded` dispatched if submit was successful
3. `setSubmitFailed` dispatched if submit was not successful (there are validation errors)
4. `validate` trigger validation