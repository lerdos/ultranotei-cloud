import { useEffect, useState } from 'react';


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
  const [paymentIDValue, setPaymentIDValue] = useState('');
  const onInputChange = value => setDefaultInputValue(value);
  const onChange = value => {
    if (value.length > 0) {
      value[0].address ? setDefaultInputValue(value[0].address) : setDefaultInputValue(value[0]);
      if (value[0].paymentID !== '') setPaymentIDValue(value[0].paymentID)
    }
  };
  const reset = () => setDefaultInputValue('');
  return {
    bind: { defaultInputValue, onInputChange, onChange },
    paymentIDValue,
    reset,
    setDefaultInputValue,
    value: defaultInputValue,
  };
};
