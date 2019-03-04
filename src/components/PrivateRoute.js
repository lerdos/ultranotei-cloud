import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthHelper from '../helpers/AuthHelper';
import Header from './elements/Header';
import NavBar from './elements/NavBar';
import Footer from './elements/Footer';


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
