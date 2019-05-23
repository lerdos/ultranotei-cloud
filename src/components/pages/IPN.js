import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';
import { useFormInput, useFormValidation } from '../../helpers/hooks';


const IPN = props => {
  const { actions, state } = useContext(AppContext);
  const { appSettings, layout, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageFee, feePerChar } = appSettings;
  const { ipn, twoFAEnabled } = userSettings;
  const { formSubmitted, sendTxResponse } = layout;

  if (sendTxResponse && sendTxResponse.redirect) {
    setTimeout(() => window.location(sendTxResponse.redirect), 10 * 1000);
  }

  const params = new URLSearchParams(props.location.search);
  const client = params.get('client');
  const ref = params.get('ref');
  const amountPredefined = params.get('amount');

  const { value: amount, bind: bindAmount, reset: resetAmount, setValue: setAmountValue } = useFormInput('');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (amountPredefined) setAmountValue(amountPredefined);
  }, []);

  useEffect(() => {
    if (Object.keys(wallets).length > 0 && (!wallet || Object.keys(wallets).length !== 0)) {
      setWallet(Object.values(wallets)[0]);
      setWalletAddress(Object.keys(wallets)[0]);
    }
  }, [wallets]);

  let formValidation = false;
  let maxValue = 0;

  if (wallet) {
    const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
    const totalMessageFee = message.length > 0 ? messageFee + message.length * feePerChar : 0;
    const txFee = parsedAmount > 0 || amount !== '' ? defaultFee : 0;
    const totalTxFee = txFee + totalMessageFee;
    const totalAmount = parsedAmount > 0 ? (parsedAmount + totalTxFee).toFixed(coinDecimals) : totalTxFee;
    maxValue = totalTxFee > 0
      ? (wallet.balance - totalTxFee).toFixed(coinDecimals)
      : (wallet.balance - defaultFee).toFixed(coinDecimals);

    const walletBalanceValid = totalAmount <= wallet.balance;
    const messageAmountValid = totalMessageFee > 0 && totalTxFee <= wallet.balance;
    const totalAmountValid = (parsedAmount >= defaultFee && totalAmount > 0) || messageAmountValid;

    formValidation = (
      walletBalanceValid &&
      totalAmountValid &&
      (twoFAEnabled
        ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
        : (password !== '' && password.length >= 8)
      )
    );
  }
  const formValid = useFormValidation(formValidation);

  return (
    <div className="donatePage">
      <div className="donateWrapper">
        <h6 className="slim-pagetitle">IPN</h6>

        <form
          onSubmit={e =>
            actions.sendTx(
              {
                e,
                wallet: walletAddress,
                client,
                amount,
                message,
                twoFACode,
                password,
                ref,
              },
              [
                resetAmount,
                resetMessage,
                resetTwoFACode,
                resetPassword,
              ],
            )
          }
        >
          <div className="row donateData">
            <div className="col-lg-12">
              <div className="form-layout form-layout-7">
                <div className="row no-gutters">
                  <div className="col-5 col-sm-2">Client ID</div>
                  <div className="col-7 col-sm-10 wallet-address">{client}</div>
                </div>
                <div className="row no-gutters">
                  <div className="col-5 col-sm-2">From Wallet</div>
                  <div className="col-7 col-sm-10">
                    <select
                      className="form-control autoWidth"
                      onChange={e => {
                        setWallet(wallets[e.target.value]);
                        setWalletAddress(e.target.value);
                      }}
                      value={walletAddress}
                    >
                      {Object.keys(wallets).map(address =>
                        <option value={address} key={address} disabled={wallets[address].balance <= 0}>
                          {maskAddress(address)} ({wallets[address].balance} CCX)
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-5 col-sm-2">Amount</div>
                  <div className="col-7 col-sm-10">
                    <input
                      {...bindAmount}
                      size={2}
                      className="form-control autoWidth"
                      placeholder="Amount"
                      name="amount"
                      type="number"
                      min={0}
                      max={maxValue}
                      step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
                    />
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-5 col-sm-2">Message</div>
                  <div className="col-7 col-sm-10">
                    <input
                      {...bindMessage}
                      size={6}
                      className="form-control maxWidth"
                      placeholder="Message"
                      name="message"
                      type="text"
                    />
                  </div>
                </div>
                <div className="row no-gutters">
                  {twoFAEnabled
                    ? <>
                      <div className="col-5 col-sm-2">2FA Code</div>
                      <div className="col-7 col-sm-10">
                        <input
                          {...bindTwoFACode}
                          size={6}
                          placeholder="2 Factor Authentication"
                          className="form-control autoWidth"
                          name="twoFACode"
                          type="number"
                          minLength={6}
                          maxLength={6}
                        />
                      </div>
                    </>
                    : <>
                      <div className="col-5 col-sm-2">Password</div>
                      <div className="col-7 col-sm-10">
                        <input
                          {...bindPassword}
                          size={6}
                          className="form-control"
                          placeholder="Password"
                          name="password"
                          type="password"
                          minLength={8}
                        />
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="reset"
              className="btn btn-outline-danger btn-uppercase-sm btnIPNS"
              onClick={() => window.location.replace(ipn.failedIpnUrl)}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className={`btn ${formValid ? 'btn-outline-success' : 'btn-outline-secondary'} btn-uppercase-sm btnIPNS`}
              disabled={formSubmitted || !formValid}
            >
              SEND
            </button>
          </div>
          {sendTxResponse &&
            <div className={`${sendTxResponse.status}-message`}>
              {
                sendTxResponse.status === 'error'
                  ? <div className="text-danger">{sendTxResponse.message}</div>
                  : <>
                    TX Hash: <a
                      href={`${appSettings.explorerURL}/index.html?hash=${sendTxResponse.message.transactionHash}#blockchain_transaction`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sendTxResponse.message.transactionHash}
                    </a><br />
                    Secret Key: {sendTxResponse.message.transactionSecretKey}
                  </>
              }
            </div>
          }
          {sendTxResponse && sendTxResponse.redirect &&
            <div>
              You will be redirected in 10 seconds...
            </div>
          }
        </form>
      </div>
    </div>
  )
};

export default IPN;
