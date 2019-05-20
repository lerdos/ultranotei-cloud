import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthHelper from '../helpers/AuthHelper';
import Header from './elements/Header';
import NavBar from './elements/NavBar';
import Footer from './elements/Footer';


const Auth = new AuthHelper();

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn()
          ? <>
              {props.location.pathname.startsWith('/donate')
                ? <Component {...props} />
                : <>
                    <Header />
                    <NavBar />
                    <Component {...props} />
                    <Footer />
                  </>
              }
            </>
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }}/>
      }
    />
  );
};

export default PrivateRoute;
