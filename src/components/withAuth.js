import React  from 'react';

import AuthHelper from './AuthHelper';
import Header from './Header';
import Footer from './Footer';


export default function withAuth(AuthComponent) {
  const Auth = new AuthHelper();

  return class AuthWrapped extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.state = {
        apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
        confirm: null,
        lastUpdate: new Date(),
        loaded: false,
        user: {},
      };

      this.getUserDetails = this.getUserDetails.bind(this);
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

          this.getUserDetails();

        } catch (err) {
          console.log(err);
          Auth.logout();
          history.replace('/login');
        }
      }
    }

    getUserDetails() {
      // console.log('GETTING USER DETAILS...');
      fetch(`${this.state.apiEndpoint}/user`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Token': Auth.getToken(),
        },
      })
        .then(r => r.json())
        .then(res => this.setState({ user: res.message }));
    }

    _handleLogout = () => {
      Auth.logout();
      this.props.history.replace('/login');
    };

    render() {
      const { confirm, lastUpdate, loaded, user } = this.state;
      const { history } = this.props;

      if (loaded && confirm) {
        return (
          <>
            <Header user={user} handleLogout={this._handleLogout} />
            <AuthComponent history={history} confirm={confirm} />
            <Footer lastUpdate={lastUpdate} />
          </>
        );
      }
      return null;
    }
  };
};
