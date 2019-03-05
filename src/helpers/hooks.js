import { useState, useEffect } from 'react';


export const useFormInput = (init) => {
  const [value, setValue] = useState(init);
  const onChange = e => setValue(e.target.value);
  const reset = () => setValue('');
  return { bind: { value, onChange }, reset, setValue, value };
};

export const useFormValidation = (init) => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};

export const useTypeaheadInput = (init) => {
  const [defaultInputValue, setDefaultInputValue] = useState(init);
  const onInputChange = value => setDefaultInputValue(value);
  const reset = () => setDefaultInputValue('');
  return { bind: { defaultInputValue, onInputChange }, reset, setDefaultInputValue, value: defaultInputValue };
};
