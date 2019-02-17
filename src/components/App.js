import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowUp,
  faArrowDown,
  faExternalLinkAlt,
  faCog,
  faGlobe,
  faHashtag,
  faHome,
  faKey,
  faLink,
  faListAlt,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import AppContextProvider from './ContextProvider';
import Login from './Login';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import Settings from './Settings';
import Dashboard from './Dashboard';

import '../static/css/slim.css';
import '../static/css/slim.one.css';


library.add(
  faArrowUp,
  faArrowDown,
  faCog,
  faExternalLinkAlt,
  faGlobe,
  faHashtag,
  faHome,
  faKey,
  faLink,
  faListAlt,
  faSignOutAlt,
  faUser,
);

const App = () => (
  <Router>
    <AppContextProvider>

      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset_password" component={ResetPassword} />
      <Route exact path="/reset_password/:token" component={ResetPassword} />

      <PrivateRoute exact path="/profile" component={Profile} />
      <PrivateRoute exact path="/settings" component={Settings} />
      <PrivateRoute exact path="/" component={Dashboard} />

    </AppContextProvider>
  </Router>
);

export default App;
