import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from './ContextProvider';


const Settings = () => {
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFADialogOpened, toggle2FADialog] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const { layout, userActions, userSettings } = useContext(AppContext);
  const { formSubmitted, message } = layout;
  useEffect(() => { validateForm() });

  const handleTwoFACodeChange = (e) => { setTwoFACode(e.target.value) };

  const validateForm = () => {
    setFormValid(parseInt(twoFACode) && twoFACode.toString().length === 6);
  };

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Settings</li>
            </ol>
            <h6 className="slim-pagetitle">Settings</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <label className="section-title">Settings</label>
            <div className="row">
              <div className="col-lg-12">
                <div className="form-layout form-layout-7">
                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start">
                      2 Factor Authentication
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      Your two-factor authentication is currently&nbsp;
                      <strong className={userSettings.twoFAEnabled ? 'text-success' : 'text-danger'}>
                        {userSettings.twoFAEnabled ? 'ENABLED' : 'DISABLED' }
                      </strong>.

                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          toggle2FADialog(!twoFADialogOpened);
                          if (layout.qrCodeUrl === '') userActions.getQRCode();
                        }}
                      >
                        {userSettings.twoFAEnabled ? 'DISABLE' : 'ENABLE' }
                      </button>

                      {twoFADialogOpened &&
                      <>
                        {message &&
                          <div className="text-danger text-center">{message}</div>
                        }
                        {userSettings.twoFAEnabled &&
                        <>
                          <p>
                            Enter the passcode from your authenticator app to disable two-factor authentication.
                          </p>
                          <form onSubmit={(e) => userActions.update2FA(e, twoFACode, false)}>
                            <div className="form-layout form-layout-7">
                              <div className="row no-gutters">
                                <div className="col-5 col-sm-4">
                                  2FA Key
                                </div>
                                <div className="col-7 col-sm-8 wallet-address">
                                  <input
                                    placeholder="2 Factor Authentication Key"
                                    type="number"
                                    name="twoFACode"
                                    className="form-control"
                                    value={twoFACode}
                                    minLength={6}
                                    maxLength={6}
                                    onChange={handleTwoFACodeChange}
                                  />
                                </div>
                              </div>
                              <button
                                type="submit"
                                disabled={formSubmitted || !formValid}
                                className="btn btn-primary btn-block btn-signin"
                              >
                                {formSubmitted ? 'Please wait...' : 'Disable'}
                              </button>
                            </div>
                          </form>
                        </>
                        }
                        {!userSettings.twoFAEnabled &&
                        <>
                          <p>
                            Scan the QR code with your two-factor authentication device to set up your account. Submit
                            the two-factor passcode which your device generates to enable 2FA.
                          </p>
                          <div>
                            <img src={layout.qrCodeUrl} alt="QR Code" />

                            <form onSubmit={(e) => userActions.update2FA(e, twoFACode, true)}>
                              <div className="form-layout form-layout-7">
                                <div className="row no-gutters">
                                  <div className="col-5 col-sm-4">
                                    2FA Key
                                  </div>
                                  <div className="col-7 col-sm-8 wallet-address">
                                    <input
                                      placeholder="2 Factor Authentication Key"
                                      type="number"
                                      name="twoFACode"
                                      className="form-control"
                                      value={twoFACode}
                                      minLength={6}
                                      maxLength={6}
                                      onChange={handleTwoFACodeChange}
                                    />
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={formSubmitted || !formValid}
                                  className="btn btn-primary btn-block btn-signin"
                                >
                                  {formSubmitted ? 'Please wait...' : 'Enable'}
                                </button>
                              </div>
                            </form>
                          </div>
                        </>
                        }
                      </>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default Settings;
