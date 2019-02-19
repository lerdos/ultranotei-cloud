import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const Settings = () => {
  const { layout, user, userActions, userSettings } = useContext(AppContext);
  const { formSubmitted, message } = layout;

  const twoFACode = useFormInput('');
  const [twoFADialogOpened, toggle2FADialog] = useState(false);

  const formValidation = (parseInt(twoFACode.value) && twoFACode.value.toString().length === 6);
  const formValid = useFormValidation(formValidation);

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
                    <div className="col-5 col-sm-4 align-items-start pd-t-15-force">
                      2 Factor Authentication
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      Your two-factor authentication is currently&nbsp;
                      <strong className={userSettings.twoFAEnabled ? 'text-success' : 'text-danger'}>
                        {userSettings.twoFAEnabled ? 'ENABLED' : 'DISABLED' }
                      </strong>.&nbsp;

                      <button
                        className={`btn btn-2fa ${userSettings.twoFAEnabled ? 'btn-outline-danger' : 'btn-outline-success' }`}
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
                          <form onSubmit={(e) => userActions.update2FA(e, twoFACode.value, false)}>
                            <div className="form-layout form-layout-7">
                              <div className="row no-gutters">
                                <div className="col-5 col-sm-4">
                                  2FA Key
                                </div>
                                <div className="col-7 col-sm-8 wallet-address">
                                  <input
                                    {...twoFACode}
                                    placeholder="2 Factor Authentication Key"
                                    type="number"
                                    name="twoFACode"
                                    className="form-control"
                                    minLength={6}
                                    maxLength={6}
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

                            <form onSubmit={(e) => userActions.update2FA(e, twoFACode.value, true)}>
                              <div className="form-layout form-layout-7">
                                <div className="row no-gutters">
                                  <div className="col-5 col-sm-4">
                                    2FA Key
                                  </div>
                                  <div className="col-7 col-sm-8 wallet-address">
                                    <input
                                      {...twoFACode}
                                      placeholder="2 Factor Authentication Key"
                                      type="number"
                                      name="twoFACode"
                                      className="form-control"
                                      minLength={6}
                                      maxLength={6}
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

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start">
                      User Name
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      {user.name}
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start">
                      Email
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      {user.email}
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start">
                      Avatar
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      {user.avatar}
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
