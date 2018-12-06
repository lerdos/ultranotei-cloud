import React, { Component } from 'react';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';
import Menu from './Menu';


class Dashboard extends Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      userName: '',
    };
  }

  _handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace('/login');
  };

  componentWillMount() {
    fetch('http://wallet.conceal.network/api/user/', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
    })
      .then(r => r.json())
      .then(res => this.setState({ userName: res.message.name }));
  }

  render() {
    const {
      userName,
    } = this.state;

    return (
      <div className="main-page">
        <h1>Welcome {userName}!</h1>
        <Menu />
        <div>
          <button onClick={this._handleLogout}>LOGOUT</button>
        </div>
      </div>
    );
  }
}

export default withAuth(Dashboard);
