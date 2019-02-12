import React  from 'react';
import update from 'immutability-helper';

import AuthHelper from './AuthHelper';
import Header from './Header';
import Footer from './Footer';


export default function withAuth(AuthComponent) {
  const Auth = new AuthHelper();

  return class AuthWrapped extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.state = {
        appSettings: {
          apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
          explorerURL: 'https://explorer.conceal.network',
          coingeckoAPI: 'https://api.coingecko.com/api/v3',
        },
        confirm: null,
        lastUpdate: new Date(),
        loaded: false,
        user: {},
        userSettings: {
          twoFAEnabled: false,
        },
      };

      this.getUserDetails = this.getUserDetails.bind(this);
      this.updateUserSettings = this.updateUserSettings.bind(this);
      this.check2FA = this.check2FA.bind(this);
      this.update2FA = this.update2FA.bind(this);
    }

    componentWillMount() {
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
        console.log(this.state)
      }
    }

    componentDidMount() {
      if (Object.keys(this.state.user).length === 0) {
        this.getUserDetails();
        this.check2FA();
      }
    }

    getUserDetails() {
      fetch(`${this.state.appSettings.apiEndpoint}/user`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Token': Auth.getToken(),
        },
      })
        .then(r => r.json())
        .then(res => this.setState({ user: res.message }));
    }

    check2FA() {
      fetch(`${this.state.appSettings.apiEndpoint}/two-factor-authentication/enabled/`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Token': Auth.getToken(),
        },
      })
        .then(r => r.json())
        .then(res => {
          this.setState(prevState =>
            update(prevState, {
              userSettings: {
                twoFAEnabled: { $set: res.message.enabled },
              }
            }));
        });
    }

    update2FA(e, code, enable) {
      e.preventDefault();
      const options = {
        method: enable ? 'PUT' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Token': Auth.getToken(),
        },
      };
      if (enable) options.body = JSON.stringify({ code });
      fetch(`${this.state.appSettings.apiEndpoint}/two-factor-authentication${enable ? '' : '?code=' + code}`, options)
        .then(r => r.json())
        .then(res => {
          this.setState(prevState =>
            update(prevState, {
              userSettings: {
                twoFAEnabled: { $set: enable ? res.message[0] : false },
              }
            }));
        });
    }

    _handleLogout = () => {
      Auth.logout();
      this.props.history.replace('/login');
    };

    updateUserSettings(data) {
      this.setState(prevState =>
        update(prevState, {
          userSettings: { $set: { [data.key]: data.value } },
        }));
    }

    render() {
      const {
        appSettings,
        confirm,
        lastUpdate,
        loaded,
        user,
        userSettings,
      } = this.state;
      const { history } = this.props;

      if (loaded && confirm) {
        return (
          <>
            <Header user={user} handleLogout={this._handleLogout} />
            <AuthComponent
              history={history}
              appSettings={appSettings}
              confirm={confirm}
              update2FA={this.update2FA}
              userSettings={userSettings}
              updateUserSettings={this.updateUserSettings}
            />
            <Footer lastUpdate={lastUpdate} />
          </>
        );
      }
      return null;
    }
  };
};
