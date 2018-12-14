import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class SignUp extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      userName: '',
      password: '',
    };

    this.signUpUser = this.signUpUser.bind(this);
  }

  componentDidMount() {
    if(this.Auth.loggedIn()) this.props.history.push('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signUpUser(event) {
    event.preventDefault();
    const {
      email,
      userName,
      password,
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
        console.log(res);
        this.props.history.replace('/login');
      });
  };

  render() {
    const {
      userName,
      password,
      email,
    } = this.state;

    return (
      <div id="register">
        <h1>Register</h1>
        <form onSubmit={this.signUpUser}>
          <input
            placeholder="User Name"
            type="text"
            name="userName"
            value={userName}
            onChange={this._handleChange}
          />
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
          <button type="submit">Submit</button>
        </form>

        <div>
          Already have an account? <Link className="link" to="/login">Login</Link>
        </div>
        ​
      </div>
    );
  }
}

export default SignUp;
