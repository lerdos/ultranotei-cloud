import React from 'react';
import { Link } from 'react-router-dom';

import AuthHelper from './AuthHelper';


class ResetPassword extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      formSubmitted: false,
      formValid: false,
      message: null,
    };

    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount() {
    if(this.Auth.loggedIn()) this.props.history.push('/dashboard');
  }

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm());
  };

  _validateForm = () => {
    const { email } = this.state;
    const formValid = email !== '';
    this.setState({ formValid });
  };

  resetPassword(e) {
    e.preventDefault();
    this.setState({ formSubmitted: true, message: null });
    const {
      email,
    } = this.state;

    fetch('http://wallet.conceal.network/api/auth/', {
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
        this.setState({ formSubmitted: false, message: res.message });
      });
  };

  render() {
    const {
      email,
      message,
      formSubmitted,
      formValid,
    } = this.state;

    return (
      <div id="reset-password">
        <h1>Reset Password</h1>
        <form onSubmit={this.resetPassword}>
          <input
            placeholder="E-mail"
            type="email"
            name="email"
            value={email}
            onChange={this._handleChange}
          />
          <button
            type="submit"
            disabled={formSubmitted || !formValid}
          >
            Submit
          </button>
        </form>

        {message &&
          <div className="error-message">{message}</div>
        }

        <div>
          Don't have an account yet? <Link className="link" to="/signup">Sign up</Link><br />
          Already have an account? <Link className="link" to="/login">Login</Link>
        </div>
        ​
      </div>
    );
  }
}

export default ResetPassword;
