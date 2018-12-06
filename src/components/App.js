import React from 'react';
import { Redirect } from 'react-router-dom';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';

import '../static/css/style.css';

class App extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }

  render() {
    return (
      <div className="App">
        {this.props.history.location.pathname === "/" ? <Redirect to="/dashboard" /> : null}
      </div>
    );
  }
}

export default withAuth(App);
