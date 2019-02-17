import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthHelper from '../helpers/AuthHelper';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';


class PrivateRoute extends React.Component {

  Auth = new AuthHelper();

  render() {
    const { component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          this.Auth.loggedIn()
            ? (
              <>
                <Header />
                <NavBar />
                <Component {...props} />
                <Footer />
              </>
            )
            : (<Redirect to={{ pathname: '/login', state: { from: props.location } }}/>)
        }
      />
    );
  }
}

export default PrivateRoute;
