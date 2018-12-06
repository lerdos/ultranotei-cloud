import React, { Component } from 'react';

import AuthHelper from './AuthHelper';


export default function withAuth(AuthComponent) {
  const Auth = new AuthHelper();

  return class AuthWrapped extends Component {
    state = {
      confirm: null,
      loaded: false,
    };

    componentDidMount() {
      const { history } = this.props;

      if (!Auth.loggedIn()) {
        history.replace('/login');
      } else {
        try {
          const confirm = Auth.decodeToken();
          this.setState({
            confirm,
            loaded: true,
          });
        } catch (err) {
          console.log(err);
          Auth.logout();
          history.replace('/login');
        }
      }
    }

    render() {
      if (this.state.loaded && this.state.confirm) {
        return (
          <AuthComponent
            history={this.props.history}
            confirm={this.state.confirm}
          />
        );
      }
      return null;
    }
  };
}
