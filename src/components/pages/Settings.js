import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import {useFormInput, useFormValidation, useTypeaheadInput} from '../../helpers/hooks';
import {Typeahead} from 'react-bootstrap-typeahead';


const Settings = () => {
  const { actions, state } = useContext(AppContext);
  const { getQRCode, updateUser, resetPassword, update2FA, updateIPNConfig } = actions;
  const { appSettings, layout, user, userSettings, wallets } = state;
  const { ipn, twoFAEnabled } = userSettings;
  const { formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const [avatar, setAvatar] = useState(user.avatar);
  const [twoFADialogOpened, toggle2FADialog] = useState(false);
  const { value: donationWallet, bind: bindDonationWallet } = useTypeaheadInput('');
  const { value: recipientName, bind: bindRecipientName } = useFormInput('');
  const [donationURL, setDonationURL] = useState(null);
  const { value: IPNName, bind: bindIPNName } = useFormInput( '');
  const { value: IPNWallet, bind: bindIPNWallet, setDefaultInputValue: setIPNWallet } = useTypeaheadInput('');
  const { value: IPNURL, bind: bindIPNURL } = useFormInput('');
  const { value: IPNSuccessInputURL, bind: bindIPNSuccessInputURL } = useFormInput('');
  const { value: IPNFailedInputURL, bind: bindIPNFailedInputURL } = useFormInput('');
  const { value: IPNMaxRetries, bind: bindIPNMaxRetries } = useFormInput('');
  const { value: IPNTxThreshold, bind: bindIPNTxThreshold } = useFormInput('');

  const emailValidation = (email !== user.email && email.length >= 3);
  const avatarValidation = (avatar && avatar.name);
  const twoFAFormValidation = (parseInt(twoFACode) && twoFACode.length === 6);
  const donationFormValidation = (
    donationWallet.length === 98 &&
    donationWallet.startsWith('ccx7')
  );
  const IPNFormValidation = (
    (IPNName !== '' || ipn.name !== '') &&
    IPNWallet.length === 98 &&
    IPNWallet.startsWith('ccx7') &&
    (IPNWallet !== '' || ipn.wallet !== '') &&
    (IPNURL !== '' || (ipn.ipnUrl && ipn.ipnUrl !== '')) &&
    (IPNURL.startsWith('http') || ipn.ipnUrl.startsWith('http')) &&
    (IPNSuccessInputURL !== '' || ipn.successIpnUrl !== '') &&
    (IPNSuccessInputURL.startsWith('http') || ipn.successIpnUrl.startsWith('http')) &&
    (IPNFailedInputURL !== '' || ipn.failedIpnUrl !== '') &&
    (IPNFailedInputURL.startsWith('http') || ipn.failedIpnUrl.startsWith('http')) &&
    (parseInt(IPNMaxRetries) || ipn.maxRetries) &&
    (parseInt(IPNTxThreshold) || ipn.txThreshold)
  );

  const emailValid = useFormValidation(emailValidation);
  const avatarValid = useFormValidation(avatarValidation);
  const twoFAFormValid = useFormValidation(twoFAFormValidation);
  const donationFormValid = useFormValidation(donationFormValidation);
  const IPNFormValid = useFormValidation(IPNFormValidation);

  useEffect(() => {
    let url = appSettings.donationURL;
    if (donationWallet) url = `${url}/${donationWallet}`;
    if (donationWallet && recipientName) url = `${url}/${encodeURIComponent(recipientName)}`;
    if (donationWallet === '') url = null;
    let donateHTML = url
      ? `<a href="${url}" target="_blank">DONATE</a>`
      : null;
    setDonationURL(donateHTML);
  }, [donationWallet, recipientName]);

  const handleDonationURLFocus = event => event.target.firstChild
    ? event.target.firstChild.select()
    : event.target.select();

  const handleIPNKeyFocus = event => event.target.firstChild
    ? event.target.firstChild.select()
    : event.target.select();

  useEffect(() => {
    if (ipn.wallet) setIPNWallet(ipn.wallet);
  }, [ipn]);

  return (
    <div>
      <div className="slim-mainpanel settings">
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
            {message &&
              <div className="text-danger mg-b-20">{message}</div>
            }
            <div className="row">
              <div className="col-lg-12">
                <div className="form-layout form-layout-7">

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      User Name
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      {user.name}
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Email
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <form onSubmit={e => updateUser({ e, email })}>
                        <div className="input-group">
                          <input
                            {...bindEmail}
                            placeholder={user.email}
                            type="email"
                            name="email"
                            className="form-control"
                            minLength={3}
                          />
                          <span className="input-group-btn">
                            <button
                              className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
                              type="submit"
                              disabled={!emailValid || formSubmitted}
                            >
                              Change E-mail
                            </button>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      Avatar
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <div className="input-group">
                        <input
                          type="file"
                          name="avatar"
                          className="form-control custom-file-input"
                          onChange={e => setAvatar(e.target.files[0])}
                        />
                        <span className="input-group-btn">
                          <button
                            className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
                            type="submit"
                            disabled={!avatarValid || formSubmitted}
                            onClick={e => {
                              const data = new FormData();
                              data.append('file', avatar, avatar.name);
                              updateUser({ e, avatar: data });
                            }}
                          >
                            Change Avatar
                          </button>
                        </span>
                      </div>
                      {user.avatar &&
                        <img src={user.avatar} alt="avatar" className="mg-t-20" />
                      }
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4">
                      Password
                    </div>
                    <div className="col-7 col-sm-8 wallet-address row-text-button">
                      <div className="settingsText">
                        Click on the button to send reset password link to <strong>{user.email}</strong>
                      </div>
                      <div className="settingsButton">
                        <button
                          className="btn btn-outline-primary btn-uppercase-sm"
                          onClick={e =>
                            window.confirm('Send reset password email? You will be logged out!') &&
                            resetPassword(e, user.email)}
                          >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      2 Factor Authentication
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <div className="row-text-button">
                        <div className="settingsText">
                          Your two-factor authentication is currently&nbsp;
                          <strong className={twoFAEnabled ? 'text-success' : 'text-danger'}>
                            {twoFAEnabled ? 'ENABLED' : 'DISABLED' }
                          </strong>.&nbsp;
                        </div>
                        <div className="settingsButton">
                          <button
                          className={`btn btn-uppercase-sm ${twoFAEnabled ? 'btn-outline-danger' : 'btn-outline-success' }`}
                          onClick={() => {
                            toggle2FADialog(!twoFADialogOpened);
                            if (layout.qrCodeUrl === '') getQRCode();
                          }}
                          >
                          {twoFAEnabled ? 'Disable' : 'Enable' }
                          </button>
                        </div>
                      </div>

                      {twoFADialogOpened &&
                        <div className="twofa-dialog">
                          {twoFAEnabled &&
                          <>
                            <p>
                              Enter the passcode from your authenticator app to disable two-factor authentication.
                            </p>
                            <form
                              onSubmit={e =>
                                update2FA(
                                  {
                                    e,
                                    twoFACode,
                                    enable: false,
                                  },
                                  [
                                    resetTwoFACode,
                                    toggle2FADialog,
                                  ],
                                )
                              }
                            >
                              <div className="form-layout form-layout-7">
                                <div className="row no-gutters">
                                  <div className="col-5 col-sm-4">
                                    2FA Key
                                  </div>
                                  <div className="col-7 col-sm-8 wallet-address">
                                    <input
                                      {...bindTwoFACode}
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
                                  disabled={formSubmitted || !twoFAFormValid}
                                  className="btn btn-primary btn-block btn-signin"
                                >
                                  {formSubmitted ? 'Please wait...' : 'Disable'}
                                </button>
                              </div>
                            </form>
                          </>
                          }
                          {!twoFAEnabled &&
                            <>
                              <p>
                                Scan the QR code with your two-factor authentication device to set up your account.
                                Submit the two-factor passcode which your device generates to enable 2FA.
                              </p>
                              <div>
                                <img src={layout.qrCodeUrl} alt="QR Code" />

                                <form
                                  onSubmit={e =>
                                    update2FA(
                                      {
                                        e,
                                        twoFACode,
                                        enable: true,
                                      },
                                      [
                                        resetTwoFACode,
                                        toggle2FADialog,
                                      ],
                                    )
                                  }
                                >
                                  <div className="form-layout form-layout-7">
                                    <div className="row no-gutters">
                                      <div className="col-5 col-sm-4">
                                        2FA Key
                                      </div>
                                      <div className="col-7 col-sm-8 wallet-address">
                                        <input
                                          {...bindTwoFACode}
                                          placeholder="2 Factor Authentication Key"
                                          type="number"
                                          name="twoFACode"
                                          className="form-control"
                                          max={999999}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={formSubmitted || !twoFAFormValid}
                                      className="btn btn-primary btn-block btn-signin"
                                    >
                                      {formSubmitted ? 'Please wait...' : 'Enable'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </>
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      Donation
                    </div>
                    <div className="col-7 col-sm-8">
                      <form onSubmit={e => updateUser({ e, email })}>
                        <div className="input-group donationInfo">
                          <Typeahead
                            {...bindDonationWallet}
                            id="donationWallet"
                            labelKey="donationWallet"
                            options={Object.keys(wallets)}
                            placeholder="Address"
                            emptyLabel="No wallets available"
                            highlightOnlyResult
                            selectHintOnEnter
                            minLength={1}
                            bodyContainer
                          />
                          <input
                            {...bindRecipientName}
                            type="text"
                            placeholder="Recipient Name"
                            name="recipientName"
                            className="form-control rbt-input-main"
                            maxLength={64}
                          />
                        </div>
                      </form>
                      <div>
                        {donationFormValid
                          ? <>Copy this code to preferred location: <pre onClick={handleDonationURLFocus}><input readOnly type="text" value={donationURL} /></pre></>
                          : <>Add valid Conceal address to generate HTML code.</>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters">
                    <div className="col-5 col-sm-4 align-items-start pd-t-25-force">
                      IPN
                    </div>
                    <div className="col-7 col-sm-8 wallet-address">
                      <form
                        className="form-layout form-layout-2"
                        onSubmit={e =>
                          updateIPNConfig({
                            e,
                            IPNName,
                            IPNWallet,
                            IPNURL,
                            IPNSuccessInputURL,
                            IPNFailedInputURL,
                            IPNMaxRetries,
                            IPNTxThreshold,
                          })
                        }
                      >
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            Name of the business:
                          </label>
                          <input
                            {...bindIPNName}
                            placeholder={ipn.name || 'Business Name'}
                            type="text"
                            name="ipnName"
                            className="form-control"
                            minLength={1}
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            Wallet address for receiving funds:
                          </label>
                          <Typeahead
                            {...bindIPNWallet}
                            id="IPNWallet"
                            labelKey="IPNWallet"
                            options={Object.keys(wallets)}
                            placeholder={ipn.wallet || 'Wallet Address'}
                            emptyLabel="No wallets available"
                            highlightOnlyResult
                            selectHintOnEnter
                            minLength={1}
                            bodyContainer
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            Callback URL (e.g. <code>https://example.com/ccx_transaction_received?tx=TX_HASH&ref=ORDER_ID</code>):
                          </label>
                          <input
                            {...bindIPNURL}
                            placeholder={ipn.ipnUrl || 'Callback URL'}
                            type="url"
                            name="ipnURL"
                            className="form-control"
                            minLength={10}
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            URL to redirect on successful payment:
                          </label>
                          <input
                            {...bindIPNSuccessInputURL}
                            placeholder={ipn.successIpnUrl || 'Success URL'}
                            type="url"
                            name="ipnSuccessURL"
                            className="form-control"
                            minLength={10}
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            URL to redirect on failed payment:
                          </label>
                          <input
                            {...bindIPNFailedInputURL}
                            placeholder={ipn.failedIpnUrl || 'Failed URL'}
                            type="url"
                            name="ipnFailedURL"
                            className="form-control"
                            minLength={10}
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            Number of retries to call callback URL (max. 10 times):
                          </label>
                          <input
                            {...bindIPNMaxRetries}
                            placeholder={ipn.maxRetries || 'Max. Retries'}
                            type="number"
                            name="ipnMaxRetries"
                            className="form-control"
                            min={0}
                            max={10}
                          />
                        </div>
                        <div className="form-group ipn-input">
                          <label className="form-control-label">
                            Number of confirmations before calling callback URL:
                          </label>
                          <input
                            {...bindIPNTxThreshold}
                            placeholder={ipn.txThreshold || 'Nr. of Confirmations'}
                            type="number"
                            name="ipnTxThreshold"
                            className="form-control"
                            min={1}
                            max={10}
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-outline-primary btn-uppercase-sm"
                          disabled={formSubmitted || !IPNFormValid}
                        >
                          UPDATE
                        </button>
                      </form>
                      {ipn.clientKey &&
                        <div>
                          Current Client Key:
                          <pre onClick={handleIPNKeyFocus}><input readOnly type="text" value={ipn.clientKey} /></pre>
                          Use the URL above to receive CCX payments from your Website.
                        </div>
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
