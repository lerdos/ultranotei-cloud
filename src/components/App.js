import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
  faAddressBook,
  faArrowUp,
  faArrowDown,
  faCheck,
  faCopy,
  faCog,
  faDollarSign,
  faExternalLinkAlt,
  faGlobe,
  faHashtag,
  faHome,
  faKey,
  faLink,
  faListAlt,
  faNetworkWired,
  faSignOutAlt,
  faTrashAlt,
  faTrophy,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';

import AppContextProvider from './ContextProvider';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';
import AddressBook from './pages/AddressBook';
import Settings from './pages/Settings';
import GettingStarted from './pages/GettingStarted';
import UpcomingFeatures from './pages/UpcomingFeatures';

import '../static/css/slim.css';
import '../static/css/slim.one.css';


library.add(
  fab,
  far,
  faAddressBook,
  faArrowUp,
  faArrowDown,
  faCheck,
  faCopy,
  faCog,
  faDollarSign,
  faExternalLinkAlt,
  faGlobe,
  faHashtag,
  faHome,
  faKey,
  faLink,
  faListAlt,
  faNetworkWired,
  faSignOutAlt,
  faTrashAlt,
  faTrophy,
  faUserEdit,
);

const App = () => (
  <Router>
    <AppContextProvider>

      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset_password" component={ResetPassword} />
      <Route exact path="/reset_password/:token" component={ResetPassword} />
      <Route exact path="/terms" component={Terms} />

      <PrivateRoute exact path="/" component={Dashboard} />
      <PrivateRoute exact path="/address_book" component={AddressBook} />
      <PrivateRoute exact path="/settings" component={Settings} />
      <PrivateRoute exact path="/getting_started" component={GettingStarted} />
      <PrivateRoute exact path="/upcoming_features" component={UpcomingFeatures} />

    </AppContextProvider>
  </Router>
);

export default App;
