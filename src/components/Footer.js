import React from 'react';


const Footer = (props) => {
  const { lastUpdate } = props;

  return (
    <div className="slim-footer">
      <div className="container">
        <p>Copyright 2018 &copy; All Rights Reserved. Conceal Network</p>
        <p>Last Update: {lastUpdate.toUTCString()}</p>
      </div>
    </div>
  )
};

export default Footer;
