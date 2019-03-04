import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../../static/img/logo.svg';

const Header = () => (
  <div className="slim-header">
    <div className="container">
      <div className="slim-header-left">
        {/*<img src={logo} alt="Logo" />*/}
        <Logo className="logo" />
        <div className="logoText">
          <h2 className="slim-logo">
            <Link to="/"><span>CLOUD Wallet</span></Link>
          </h2>
        </div>
      </div>
      <div className="slim-header-right">
        <span className="beta-header">BETA</span>
      </div>
    </div>
  </div>
);

export default Header;
