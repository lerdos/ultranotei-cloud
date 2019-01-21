import React from 'react';
import { Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowUp,
  faArrowDown,
  faExternalLinkAlt,
  faKey,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';

import withAuth from './withAuth';
import AuthHelper from './AuthHelper';

import '../static/css/slim.css';
import '../static/css/slim.one.css';

library.add(faArrowUp);
library.add(faArrowDown);
library.add(faExternalLinkAlt);
library.add(faKey);
library.add(faListAlt);

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
