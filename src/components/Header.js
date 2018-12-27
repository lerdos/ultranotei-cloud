import React from 'react';
import { Link } from 'react-router-dom';
import IosPerson from 'react-ionicons/lib/IosPerson';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavLink from 'react-bootstrap/lib/NavLink';


const Header = (props) => {
  const { handleLogout, user } = props;
  return (
    <div className="slim-header">
      <div className="container">
        <div className="slim-header-left">
          <h2 className="slim-logo"><a href="/">Conceal</a></h2>
        </div>
        <div className="slim-header-right">
          <Dropdown as={NavItem} className="dropdown dropdown-c">
            <Dropdown.Toggle as={NavLink}>Welcome back {user.name}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Link to="/profile" className="nav-link">
                <IosPerson /> Your Profile
              </Link>
              <Link to="/settings" className="nav-link">
                <i className="icon ion-ios-gear" /> Account Settings
              </Link>
              <Link to="/#logout" className="nav-link" onClick={handleLogout}>
                <i className="icon ion-forward" /> Sign Out
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
};

export default Header;
