import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import DonationForm from '../elements/Settings/DonationForm';
import IPNForm from '../elements/Settings/IPNForm';


const PaySettings = () => {
  const { state } = useContext(AppContext);
  const { wallets } = state;

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Conceal Pay</li>
            </ol>
            <h6 className="slim-pagetitle">Conceal Pay</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Payment Request</label>
            <div className="row">
              <div className="col-lg-12">
                <div className="mg-b-15">
                  Create URL which you can share with others to receive payments in CCX.
                </div>
                <div className="form-layout form-layout-7">

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-baseline">
                      Receiving Wallet Address
                      <FormLabelDescription>
                        Enter wallet address (along with other optional parameters) to generate URL which can be used to
                        receive CCX
                      </FormLabelDescription>
                    </div>
                    <div className="col-7 col-sm-8"><DonationForm /></div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Instant Payment Notification</label>
            <div className="row">
              <div className="col-lg-12">
                <div className="mg-b-15">
                  Configure your Instant Payment Notification parameters to receive Client Key which you can
                  use and implement in your shopping carts and e-com software to receive Conceal as a payment method.
                </div>
                {Object.keys(wallets).length === 0
                  ? <div>
                      No wallets available. Please create one.
                    </div>
                  : <Accordion>
                      {Object.keys(wallets).map(address =>
                        <IPNForm key={address} address={address} wallet={wallets[address]} />
                      )}
                    </Accordion>
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default PaySettings;
