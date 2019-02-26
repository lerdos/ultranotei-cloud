import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const SignUp = () => {
  const { layout, user, userSettings, userActions } = useContext(AppContext);
  const { formSubmitted, message } = layout;

  const userName = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');

  const formValidation = (
    userName.value !== '' && userName.value.length >= 3 &&
    email.value !== '' && email.value.length >= 3 &&
    password.value !== '' && password.value.length >= userSettings.minimumPasswordLength
  );
  const formValid = useFormValidation(formValidation);

  if (user.loggedIn) return <Redirect to="/" />;

  return (
    <div className="signin-wrapper">

      <div className="signin-box">
        <h2 className="slim-logo"><a href="/">Conceal</a> <span className="beta-header">BETA</span></h2>
        <h3 className="signin-title-secondary">Sign Up</h3>

        <form onSubmit={(e) => userActions.signUpUser(e, userName.value, email.value, password.value)}>
          <div className="form-group">
            <input
              {...userName}
              placeholder="User Name"
              type="text"
              name="userName"
              className="form-control"
              minLength={3}
            />
          </div>
          <div className="form-group">
            <input
              {...email}
              placeholder="E-mail"
              type="email"
              name="email"
              className="form-control"
              minLength={3}
            />
          </div>
          <div className="form-group mg-b-50">
            <input
              {...password}
              placeholder="Password"
              type="password"
              name="password"
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
            {formSubmitted ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mg-b-0">Already have an account? <Link to="/login">Sign In</Link></p>
        <p className="mg-b-0">Forgot your password? <Link to="/reset_password">Reset It</Link></p>
        <hr />
        <p className="mg-b-0 box-footer">
          Copyright 2019 &copy; All Rights Reserved. Conceal Network<br /><Link to="/terms">Terms and Conditions</Link>
        </p>
      </div>
      ​
    </div>
  )
};

export default SignUp;
