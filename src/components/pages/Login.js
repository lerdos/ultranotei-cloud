import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const Login = props => {
  const { layout, user, userSettings, userActions } = useContext(AppContext);
  const { redirectToReferrer, formSubmitted, message } = layout;

  const { value: email, bind: bindEmail, /*reset: resetEmail*/ } = useFormInput('');
  const { value: password, bind: bindPassword, /*reset: resetPassword*/ } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, /*reset: resetTwoFACode*/ } = useFormInput('');

  const formValidation = (
    email !== '' && email.length >= 3 &&
    password !== '' && password.length >= userSettings.minimumPasswordLength &&
    (twoFACode !== '' ? (twoFACode.length === 6 && parseInt(twoFACode)) : true)
  );
  const formValid = useFormValidation(formValidation);

  if (user.loggedIn) return <Redirect to="/" />;

  if (redirectToReferrer) {
    const { from } = props.location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <div className="signin-wrapper">

      <div className="signin-box">
        <h2 className="slim-logo"><a href="/">Conceal Cloud</a> <span className="beta-header">BETA</span></h2>
        <h2 className="signin-title-primary">Welcome back!</h2>
        <h3 className="signin-title-secondary">Sign in to continue.</h3>

        {message &&
          <div className="alert alert-outline alert-danger text-center">{message}</div>
        }

        <form onSubmit={e => userActions.loginUser(e, email, password, twoFACode)}>
          <div className="form-group">
            <input
              {...bindEmail}
              placeholder="Enter your email"
              type="email"
              name="email"
              className="form-control"
              minLength={3}
            />
          </div>

          <div className="form-group mg-b-50">
            <input
              {...bindPassword}
              placeholder="Enter your password"
              type="password"
              name="password"
              className="form-control"
              minLength={8}
            />
          </div>

          <div className="form-group mg-b-50">
            <input
              {...bindTwoFACode}
              placeholder="2-Factor Authentication (if enabled)"
              type="number"
              name="twoFA"
              className="form-control"
              max={999999}
            />
          </div>

          <button
            type="submit"
            disabled={formSubmitted || !formValid}
            className="btn btn-primary btn-block btn-signin"
          >
            {formSubmitted ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mg-b-0">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p className="mg-b-0">Forgot your password? <Link to="/reset_password">Reset It</Link></p>
        <hr />
        <p className="mg-b-0 box-footer">
          Copyright 2019 &copy; All Rights Reserved. Conceal Network<br /><Link to="/terms">Terms &amp; Conditions</Link>
        </p>
      </div>
      ​
    </div>
  )
};

export default Login;
