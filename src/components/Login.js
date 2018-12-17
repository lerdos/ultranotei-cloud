import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class Login extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      formSubmitted: false,
      formValid: false,
      message: null,
      password: '',
    };

    this.loginUser = this.loginUser.bind(this);
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm())
  };

  _validateForm = () => {
    const { email, password } = this.state;
    const formValid = email !== '' && password !== '';
    this.setState({ formValid });
  };

  loginUser(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true, message: null });
    const {
      email,
      password,
    } = this.state;

    this.Auth.login(email, password)
      .then(res => {
        // console.log(res);
        if (res.result === 'success') return this.props.history.replace('/dashboard');
        this.setState({ formSubmitted: false, message: res.message });
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      email,
      formSubmitted,
      formValid,
      password,
      message,
    } = this.state;

    return (
      <div id="login" className="login">
        <h1>Login</h1>
        <form onSubmit={this.loginUser}>
          <input
            placeholder="E-mail"
            type="email"
            name="email"
            value={email}
            minLength={4}
            onChange={this._handleChange}
          />
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={password}
            minLength={8}
            onChange={this._handleChange}
          />
          <button
            type="submit"
            disabled={formSubmitted || !formValid}
          >
            {formSubmitted ? 'Logging In...' : 'Submit'}
            </button>
        </form>

        {message &&
          <div className="error-message">{message}</div>
        }

        <div>
          Don't have an account yet? <Link className="link" to="/signup">Sign up</Link><br />
          Lost password? <Link className="link" to="/reset_password">Reset here</Link>
        </div>
        ​
      </div>
    );
  }
}

export default Login;
