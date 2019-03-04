import { useState, useEffect } from 'react';


export const useFormInput = (init) => {
  const [value, setValue] = useState(init);
  const onChange = e => setValue(e.target.value);
  return { value, onChange };
};

export const useFormValidation = (init) => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) });
  return formValid;
};

export const useTypeaheadInput = (init) => {
  const [defaultInputValue, setDefaultInputValue] = useState(init);
  const onInputChange = value => setDefaultInputValue(value);
  return { value: defaultInputValue, defaultInputValue, onInputChange };
};
