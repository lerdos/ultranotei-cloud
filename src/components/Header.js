import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import IosPerson from 'react-ionicons/lib/IosPerson';


const Header = (props) => {
  const { handleLogout, user } = props;
  return (
    <div className="slim-header">
      <div className="container">
        <div className="slim-header-left">
          <h2 className="slim-logo"><a href="/">Conceal</a></h2>
        </div>
        <div className="slim-header-right">
          <div className="dropdown dropdown-c">
            <Link to="#" className="logged-user" data-toggle="dropdown">
              <span>Welcome back {user.name}</span>
              <FontAwesomeIcon icon={faAngleDown} />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <nav className="nav">
                <Link to="#" className="nav-link">
                  <IosPerson /> View Profile
                </Link>
                <Link to="#" className="nav-link">
                  <i className="icon ion-compose" /> Edit Profile
                </Link>
                <Link to="#" className="nav-link">
                  <i className="icon ion-ios-gear" /> Account Settings
                </Link>
                <Link to="#" className="nav-link" onClick={handleLogout}>
                  <i className="icon ion-forward" /> Sign Out
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Header;
