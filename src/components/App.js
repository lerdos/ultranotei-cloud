import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
  faAddressBook,
  faArrowUp,
  faArrowDown,
  faCaretDown,
  faCheck,
  faComments,
  faCopy,
  faCog,
  faDollarSign,
  faExternalLinkAlt,
  faExclamationTriangle,
  faGlobe,
  faHashtag,
  faHome,
  faIdCard,
  faKey,
  faLink,
  faListAlt,
  faNetworkWired,
  faReceipt,
  faQuestionCircle,
  faSignOutAlt,
  faSpinner,
  faTrashAlt,
  faTrophy,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

import AppContextProvider from './ContextProvider';
import Home from './pages/Home';
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
import Donate from './pages/Donate';
import Pay from './pages/Pay';
import PaySettings from './pages/PaySettings';
import Id from './pages/Id';

import '../static/css/slim.css';
import '../static/css/slim.one.css';


library.add(
  fab,
  far,
  faAddressBook,
  faArrowUp,
  faArrowDown,
  faCaretDown,
  faCheck,
  faComments,
  faCopy,
  faCog,
  faDollarSign,
  faExclamationTriangle,
  faExternalLinkAlt,
  faGlobe,
  faHashtag,
  faHome,
  faIdCard,
  faKey,
  faLink,
  faListAlt,
  faNetworkWired,
  faQuestionCircle,
  faReceipt,
  faSignOutAlt,
  faSpinner,
  faTrashAlt,
  faTrophy,
  faUserEdit,
);

const App = () => (
  <Router>
    <AppContextProvider>
      <ReactNotification />

      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/reset_password" component={ResetPassword} />
      <Route exact path="/reset_password/:token" component={ResetPassword} />
      <Route exact path="/terms" component={Terms} />

      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/id" component={Id} />
      <PrivateRoute exact path="/address_book" component={AddressBook} />
      <PrivateRoute exact path="/settings" component={Settings} />
      <PrivateRoute exact path="/pay_settings" component={PaySettings} />
      <PrivateRoute exact path="/getting_started" component={GettingStarted} />
      <PrivateRoute exact path="/upcoming_features" component={UpcomingFeatures} />
      <PrivateRoute exact path="/payment/:address?/:recipientName?" component={Donate} />
      <PrivateRoute exact strict path="/pay/" component={Pay} />

    </AppContextProvider>
  </Router>
);

export default App;
