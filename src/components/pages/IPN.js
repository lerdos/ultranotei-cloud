import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

import { AppContext } from '../ContextProvider';
import IPNForm from '../elements/Settings/IPNForm';


const IPN = () => {
  const { state } = useContext(AppContext);
  const { wallets } = state;

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">IPN</li>
            </ol>
            <h6 className="slim-pagetitle">Instant Payment Notification</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Settings</label>
            <div className="row">
              <div className="col-lg-12">
                <Accordion>
                  {Object.keys(wallets).map(address =>
                    <IPNForm key={address} address={address} wallet={wallets[address]} />
                  )}
                </Accordion>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default IPN;
