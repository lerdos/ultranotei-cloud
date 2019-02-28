import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const ResetPassword = (props) => {
  const { layout, user, userSettings, userActions } = useContext(AppContext);
  const { formSubmitted, message } = layout;

  const email = useFormInput('');
  const password = useFormInput('');
  const passwordConfirm = useFormInput('');

  const formValidation = (
    props.match.params.token
      ? password.value !== '' && password.value.length >= userSettings.minimumPasswordLength &&
        passwordConfirm.value !== '' && passwordConfirm.value.length >= userSettings.minimumPasswordLength &&
        password.value === passwordConfirm.value
      : email.value !== '' && email.value.length >= 3
  );
  const formValid = useFormValidation(formValidation);

  if (user.loggedIn) return <Redirect to="/" />;

  return (
    <div className="signin-wrapper">

      <div className="signin-box">
        <h2 className="slim-logo"><a href="/">Conceal</a> <span className="beta-header">BETA</span></h2>
        <h3 className="signin-title-secondary">Reset Password</h3>

        {message &&
          <div className="alert alert-outline alert-danger text-center">{message}</div>
        }

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
                minLength={3}
              />
            </div>

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
        <hr />
        <p className="mg-b-0 box-footer">
          Copyright 2019 &copy; All Rights Reserved. Conceal Network<br /><Link to="/terms">Terms and Conditions</Link>
        </p>
      </div>
      ​
    </div>
  )
};

export default ResetPassword;
