import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class Login extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
      message: null,
      loggingIn: false,
    };

    this.loginUser = this.loginUser.bind(this);
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  };

  loginUser(event) {
    event.preventDefault();
    this.setState({ loggingIn: true });
    const {
      email,
      password,
    } = this.state;

    this.Auth.login(email, password)
      .then(res => {
        if (res.result === 'error') {
          this.setState({ message: res.message, loggingIn: false });
          return;
        }
        this.props.history.replace('/dashboard');
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      email,
      password,
      message,
      loggingIn,
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
            onChange={this._handleChange}
          />
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={password}
            onChange={this._handleChange}
          />
          <button type="submit" disabled={loggingIn}>{loggingIn ? 'Logging In...' : 'Submit'}</button>
        </form>

        {message &&
          <div className="login-message">{message}</div>
        }

        <div>
          Don't have an account yet? <Link className="link" to="/signup">Sign up</Link>
        </div>
        ​
      </div>
    );
  }
}

export default Login;
