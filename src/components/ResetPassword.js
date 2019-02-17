import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from './ContextProvider';
import { useFormInput, useFormValidation } from '../helpers/hooks';


const ResetPassword = (props) => {
  const { layout, user, userActions } = useContext(AppContext);
  const { formSubmitted, message } = layout;

  const email = useFormInput('');
  const password = useFormInput('');
  const passwordConfirm = useFormInput('');

  const formValidation = (
    props.match.params.token
      ? password.value !== '' && passwordConfirm.value !== '' && password.value === passwordConfirm.value
      : email.value !== ''
  );
  const formValid = useFormValidation(formValidation);

  if (user.loggedIn) return <Redirect to="/" />;

  return (
    <div className="signin-wrapper">

      <div className="signin-box">
        <h2 className="slim-logo"><a href="/">Conceal</a> <span className="beta-header">BETA</span></h2>
        <h3 className="signin-title-secondary">Reset Password</h3>

        {props.match.params.token
          ? <form onSubmit={(e) => userActions.resetPasswordConfirm(e, password.value, props.match.params.token)}>
              <div className="form-group">
                <input
                  {...password}
                  placeholder="New Password"
                  type="password"
                  name="password"
                  className="form-control"
                  minLength={8}
                />
              </div>
              <div className="form-group mg-b-50">
                <input
                  {...passwordConfirm}
                  placeholder="Confirm New Password"
                  type="password"
                  name="passwordConfirm"
                  className="form-control"
                  minLength={8}
                />
              </div>

              {message &&
                <div className="text-danger text-center">{message}</div>
              }

              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className="btn btn-primary btn-block btn-signin"
              >
                {formSubmitted ? 'Please wait...' : 'Submit'}
              </button>
            </form>
          : <form onSubmit={(e) => userActions.resetPassword(e, email.value)}>
            <div className="form-group mg-b-50">
              <input
                {...email}
                placeholder="Enter your email"
                type="email"
                name="email"
                className="form-control"
                minLength={4}
              />
            </div>

            {message &&
              <div className="text-danger text-center">{message}</div>
            }

            <button
              type="submit"
              disabled={formSubmitted || !formValid}
              className="btn btn-primary btn-block btn-signin"
            >
              {formSubmitted ? 'Please wait...' : 'Submit'}
            </button>
          </form>
        }

        <p className="mg-b-0">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p className="mg-b-0">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
      ​
    </div>
  )
};

export default ResetPassword;
