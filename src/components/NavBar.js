import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from './ContextProvider';


const NavBar = () => {
  const { appSettings, userActions } = useContext(AppContext);

  return (
    <div className="slim-navbar">
      <div className="container">

        <ul className="nav">
          <li className="nav-item">
            <NavLink exact to="/" className="nav-link hot_link" activeClassName="active">
              <FontAwesomeIcon icon="home" fixedWidth /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link hot_link" activeClassName="active">
              <FontAwesomeIcon icon="user" fixedWidth /> <span>Profile</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" className="nav-link hot_link" activeClassName="active">
              <FontAwesomeIcon icon="cog" fixedWidth /> <span>Settings</span>
            </NavLink>
          </li>
          <li className="nav-item with-sub">
            <button className="nav-link hot_link" data-toggle="dropdown">
              <FontAwesomeIcon icon="globe" fixedWidth /> <span>Ecosystem</span>
            </button>
            <div className="sub-item">
              <ul>
                <li>
                  <a href={appSettings.homePage} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon="home" fixedWidth /> <span>Conceal Website</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.explorerURL} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon="link" fixedWidth /> <span>Blockchain Explorer</span>
                  </a>
                </li>
                <li>
                  <a href={appSettings.poolURL} className="hot_link" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon="hashtag" fixedWidth /> <span>Mining Pool</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <button className="nav-link hot_link" onClick={userActions.logoutUser}>
              <FontAwesomeIcon icon="sign-out-alt" fixedWidth /> Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
};

export default NavBar;
