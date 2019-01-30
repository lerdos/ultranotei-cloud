import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Settings from './components/Settings';
import SignUp from './components/SignUp';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset_password" component={ResetPassword} />
      <Route exact path="/reset_password/:token" component={ResetPassword} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/settings" component={Settings} />
    </div>
  </Router>,
  document.getElementById('root')
);

serviceWorker.register();
