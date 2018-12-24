import React from 'react';
import { Redirect } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';

import '../static/css/slim.css';
import '../static/css/slim.one.css';


class App extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div>
        {this.props.history.location.pathname === "/" ? <Redirect to="/dashboard" /> : null}
      </div>
    );
  }
}

export default withAuth(App);
