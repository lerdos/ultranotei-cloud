import React, { useContext } from 'react';

import { AppContext } from '../../ContextProvider';
import { useFormInput, useFormValidation } from '../../../helpers/hooks';


const EmailForm = () => {
  const { actions, state } = useContext(AppContext);
  const { updateUser } = actions;
  const { layout, user } = state;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');

  const emailValidation = (email !== user.email && email.length >= 3);
  const emailValid = useFormValidation(emailValidation);

  return (
    <>
      {message && message.emailForm &&
        <div className="text-danger mg-b-20">{message.emailForm}</div>
      }
      <form onSubmit={e => updateUser({ e, email, id: 'emailForm' })}>
        <div className="input-group">
          <input
            {...bindEmail}
            placeholder={user.email}
            type="email"
            name="email"
            className="form-control"
            minLength={3}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
              type="submit"
              disabled={!emailValid || formSubmitted}
            >
              Change E-mail
            </button>
          </span>
        </div>
      </form>
    </>
  )
};

export default EmailForm;
