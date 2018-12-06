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
    const {
      email,
      password,
    } = this.state;

    this.Auth.login(email, password)
      .then(res => {
        if (res === false) return alert('Wrong credentials');
        this.props.history.replace('/dashboard');
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      email,
      password,
    } = this.state;

    return (
      <div id="login">
        <h1>Login</h1>
        <form onSubmit={this.loginUser}>
          <input
            placeholder="E-mail"
            type="text"
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
          <button type="Submit">Submit</button>
        </form>

        <div>
          Don't have an account yet? <Link className="link" to="/signup">Sign up</Link>
        </div>
        ​
      </div>
    );
  }
}

export default Login;
