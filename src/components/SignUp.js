import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class SignUp extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      formSubmitted: false,
      formValid: false,
      message: null,
      password: '',
      userName: '',
    };

    this.signUpUser = this.signUpUser.bind(this);
  }

  componentDidMount() {
    if(this.Auth.loggedIn()) this.props.history.push('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm());
  };

  _validateForm = () => {
    const { email, password, username } = this.state;
    const formValid = (
      email !== '' &&
      password !== '' &&
      username !== ''
    );
    this.setState({ formValid });
  };

  signUpUser(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true, message: null });
    const {
      email,
      password,
      userName,
    } = this.state;

    fetch('http://wallet.conceal.network/api/user/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: userName,
        password,
      }),
    })
      .then(r => r.json())
      .then(res => {
        // console.log(res);
        if (res.result === 'success') return this.props.history.replace('/login');
        this.setState({ formSubmitted: false, message: res.message });
      });
  };

  render() {
    const {
      email,
      formSubmitted,
      formValid,
      message,
      password,
      userName,
    } = this.state;

    return (
      <div className="signin-wrapper">

        <div className="signin-box">
          <h2 className="slim-logo"><a href="/">Conceal</a></h2>
          <h3 className="signin-title-secondary">Sign Up</h3>

          <form onSubmit={this.signUpUser}>
            <div className="form-group">
              <input
                placeholder="User Name"
                type="text"
                name="userName"
                className="form-control"
                value={userName}
                minLength={4}
                onChange={this._handleChange}
              />
            </div>
            <div className="form-group">
              <input
                placeholder="E-mail"
                type="email"
                name="email"
                className="form-control"
                value={email}
                onChange={this._handleChange}
              />
            </div>
            <div className="form-group mg-b-50">
              <input
                placeholder="Password"
                type="password"
                name="password"
                className="form-control"
                value={password}
                minLength={8}
                onChange={this._handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitted || !formValid}
              className="btn btn-primary btn-block btn-signin"
            >
              Submit
            </button>
          </form>

          {message &&
          <div className="error-message">{message}</div>
          }

          <p className="mg-b-0">Already have an account? <Link to="/login">Sign In</Link></p>
          <p className="mg-b-0">Forgot your password? <Link to="/reset_password">Reset It</Link></p>
        </div>
        ​
      </div>
    );
  }
}

export default SignUp;
