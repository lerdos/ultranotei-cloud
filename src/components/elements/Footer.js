import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';


const Footer = () => {
  const { state } = useContext(AppContext);
  const { appSettings, layout } = state;

  return (
    <div className="slim-footer">
      <div className="container">
        <p>
          Copyright 2019 &copy; All Rights Reserved. Conceal Network | <Link to="/terms">Terms &amp; Conditions</Link>
        </p>
        <p>Version: {appSettings.appVersion} | Last Update: {layout.lastUpdate.toUTCString()}</p>
      </div>
    </div>
  )
};

export default Footer;
