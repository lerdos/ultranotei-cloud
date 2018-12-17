import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import SignUp from './components/SignUp';
import * as serviceWorker from './serviceWorker';
import './static/css/layout.css';


ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/reset_password" component={ResetPassword} />
    </div>
  </Router>,
  document.getElementById('root')
);

serviceWorker.register();
