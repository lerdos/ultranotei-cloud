import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
                <FontAwesomeIcon icon="user" fixedWidth /> Your Profile
              </Link>
              <Link to="/settings" className="nav-link">
                <FontAwesomeIcon icon="cog" fixedWidth /> Account Settings
              </Link>
              <Link to="/#logout" className="nav-link" onClick={handleLogout}>
                <FontAwesomeIcon icon="sign-out-alt" fixedWidth /> Sign Out
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
};

export default Header;
