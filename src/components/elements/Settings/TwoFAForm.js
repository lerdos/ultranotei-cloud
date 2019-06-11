import React, { useContext, useState } from 'react';

import { AppContext } from '../../ContextProvider';
import { useFormInput, useFormValidation } from '../../../helpers/hooks';


const TwoFAForm = () => {
  const { actions, state } = useContext(AppContext);
  const { getQRCode, update2FA } = actions;
  const { layout, userSettings } = state;
  const { twoFAEnabled } = userSettings;
  const { formSubmitted, message } = layout;

  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const [twoFADialogOpened, toggle2FADialog] = useState(false);

  const twoFAFormValidation = (parseInt(twoFACode) && twoFACode.length === 6);
  const twoFAFormValid = useFormValidation(twoFAFormValidation);

  return (
    <>
      {message.twoFAForm &&
        <div className="text-danger mg-b-20">{message.twoFAForm}</div>
      }
      <div className="row-text-button">
        <div className="settingsText">
          Your two-factor authentication is currently&nbsp;
          <strong className={twoFAEnabled ? 'text-success' : 'text-danger'}>
            {twoFAEnabled ? 'ENABLED' : 'DISABLED'}
          </strong>.&nbsp;
        </div>
        <div className="settingsButton">
          <button
            className={`btn btn-uppercase-sm ${twoFAEnabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
            onClick={() => {
              toggle2FADialog(!twoFADialogOpened);
              if (layout.qrCodeUrl === '' && !twoFAEnabled) getQRCode();
            }}
          >
            {twoFAEnabled ? 'Disable' : 'Enable'}
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
                      id: 'twoFAForm',
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
                        id: 'twoFAForm',
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
    </>
  )
};

export default TwoFAForm;
