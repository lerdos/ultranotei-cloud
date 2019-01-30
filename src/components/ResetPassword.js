import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class ResetPassword extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
      email: '',
      formSubmitted: false,
      formValid: false,
      message: null,
      password: '',
      passwordConfirm: '',
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.resetPasswordConfirm = this.resetPasswordConfirm.bind(this);
  }

  componentDidMount() {
    if(this.Auth.loggedIn()) this.props.history.push('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm());
  };

  _validateForm = () => {
    const { email, password, passwordConfirm } = this.state;
    const { match } = this.props;
    const formValid = match.params.token
      ? password !== '' && passwordConfirm !== '' && password === passwordConfirm
      : email !== '';
    this.setState({ formValid });
  };

  resetPassword(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true, message: null });
    const {
      apiEndpoint,
      email,
    } = this.state;

    fetch(`${apiEndpoint}/auth/`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then(r => r.json())
      .then(res => {
        console.log(res);
        if (res.result === 'success') return this.props.history.replace('/login');
        this.setState({ formSubmitted: false, message: res.message[0] });
      });
  };

  resetPasswordConfirm(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true, message: null });
    const { match } = this.props;
    const {
      apiEndpoint,
      password,
    } = this.state;
    fetch(`${apiEndpoint}/auth/`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Token: match.params.token,
      },
      body: JSON.stringify({ password }),
    })
      .then(r => r.json())
      .then(res => {
        console.log(res);
        if (res.result === 'success') return this.props.history.replace('/login');
        this.setState({ formSubmitted: false, message: res.message[0] });
      });
  }

  render() {
    const {
      email,
      message,
      formSubmitted,
      formValid,
      password,
      passwordConfirm,
    } = this.state;
    const { match } = this.props;

    return (
      <div className="signin-wrapper">

        <div className="signin-box">
          <h2 className="slim-logo"><a href="/">Conceal</a></h2>
          <h3 className="signin-title-secondary">Reset Password</h3>

          {match.params.token
            ? <form onSubmit={this.resetPasswordConfirm}>
              <div className="form-group">
                <input
                  placeholder="New Password"
                  type="password"
                  name="password"
                  className="form-control"
                  value={password}
                  minLength={8}
                  onChange={this._handleChange}
                />
              </div>
              <div className="form-group mg-b-50">
                <input
                  placeholder="Confirm New Password"
                  type="password"
                  name="passwordConfirm"
                  className="form-control"
                  value={passwordConfirm}
                  minLength={8}
                  onChange={this._handleChange}
                />
              </div>

              {message &&
                <div className="text-danger">{message}</div>
              }

              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className="btn btn-primary btn-block btn-signin"
              >
                Submit
              </button>
            </form>
            : <form onSubmit={this.resetPassword}>
              <div className="form-group mg-b-50">
                <input
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={email}
                  minLength={4}
                  onChange={this._handleChange}
                />
              </div>

              {message &&
              <div className="text-danger">{message}</div>
              }

              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className="btn btn-primary btn-block btn-signin"
              >
                Submit
              </button>
            </form>
          }

          <p className="mg-b-0">Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p className="mg-b-0">Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
        ​
      </div>
    );
  }
}

export default ResetPassword;
