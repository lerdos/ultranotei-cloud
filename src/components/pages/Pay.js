import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';
import { useFormInput, useFormValidation } from '../../helpers/hooks';
import Button from 'react-bootstrap/Button';


const Pay = props => {
  const { actions, state } = useContext(AppContext);
  const { createWallet, sendTx } = actions;
  const { appSettings, layout, marketData, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageFee, feePerChar } = appSettings;
  const { ipn, twoFAEnabled } = userSettings;
  const { formSubmitted, sendTxResponse, walletsLoaded } = layout;

  if (sendTxResponse && sendTxResponse.redirect) {
    setTimeout(() => {
      window.location.href = sendTxResponse.redirect;
    }, 10 * 1000);
  }

  const params = new URLSearchParams(props.location.search);
  const client = params.get('client');
  const ref = params.get('ref');
  const amountPredefined = params.get('amount');

  const { value: amount, bind: bindAmount, reset: resetAmount, setValue: setAmountValue } = useFormInput('');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const [availableWallets, setAvailableWallets] = useState({});
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [btcValue, setBtcValue] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  useEffect(() => {
    if (amountPredefined) setAmountValue(amountPredefined);
  }, []);

  useEffect(() => {
    const availableWallets = Object.keys(wallets)
      .reduce((acc, curr) => {
        if (wallets[curr].balance > 0) acc[curr] = wallets[curr];
        return acc;
      }, {});
    const selectedAddress = Object.keys(availableWallets)[0];
    const selectedWallet = wallets[selectedAddress];
    if (selectedAddress && selectedWallet) {
      setWalletAddress(selectedAddress);
      setWallet(selectedWallet);
    }
    setAvailableWallets(availableWallets);
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

  const ccxToUSD =  marketData ? marketData.market_data.current_price.usd : 0;
  const ccxToBTC =  marketData ? marketData.market_data.current_price.btc : 0;

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      setBtcValue(parseFloat(amount) * ccxToBTC);
      setUsdValue(parseFloat(amount) * ccxToUSD);
    } else {
      setBtcValue(0);
      setUsdValue(0);
    }
  }, [amount]);

  const btcFormatOptions = {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  };

  const usdFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return (
    <div className="donatePage">
      <div className="donateWrapper">
        <h6 className="slim-pagetitle">Conceal Pay</h6>

        {walletsLoaded && !ipn &&
          <div className="mg-t-15">
            <h5>Invalid Client Key</h5>
            Verify that Client Key is correct or contact shop owner.
          </div>
        }

        {ipn &&
          <>
            <div className="mg-t-15">
              A payment processor to accept crypto as payment....<br />
              Sending {amount} CCX to {ipn.name}.
            </div>

            <form
              onSubmit={e =>
                sendTx(
                  {
                    e,
                    wallet: walletAddress,
                    client,
                    amount,
                    message,
                    twoFACode,
                    password,
                    ref,
                    id: 'ipnForm',
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
                        {walletsLoaded && Object.keys(availableWallets).length > 0 &&
                          <select
                            className="form-control autoWidth"
                            onChange={e => {
                              setWallet(wallets[e.target.value]);
                              setWalletAddress(e.target.value);
                            }}
                            value={walletAddress}
                          >
                            {Object.keys(availableWallets).map(address =>
                              <option value={address} key={address}>
                                {maskAddress(address)} ({wallets[address].balance} CCX)
                              </option>
                            )}
                          </select>
                        }
                        {walletsLoaded && Object.keys(wallets).length > 0 && Object.keys(availableWallets).length === 0 &&
                          <div>
                            Balance too low. Send some funds to your wallet to process this payment.
                          </div>
                        }
                        {walletsLoaded && Object.keys(wallets).length === 0 &&
                          <div>
                            You have no wallets yet. Create one
                            <Button className="btn-uppercase-sm btn-create-wallet" onClick={() => createWallet()}>
                              here
                            </Button>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="row no-gutters">
                      <div className="col-5 col-sm-2">Amount</div>
                      <div className="col-7 col-sm-10">
                        <input
                          {...bindAmount}
                          size={2}
                          className="form-control autoWidth float-left"
                          placeholder="Amount"
                          name="amount"
                          type="number"
                          min={0}
                          max={maxValue}
                          step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
                          disabled={Object.keys(availableWallets).length === 0}
                        />
                        <div className="float-left">
                          BTC: {btcValue.toLocaleString(undefined, btcFormatOptions)}<br />
                          USD: {usdValue.toLocaleString(undefined, usdFormatOptions)}
                        </div>
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
                          disabled={Object.keys(availableWallets).length === 0}
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
                              disabled={Object.keys(availableWallets).length === 0}
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
                              disabled={Object.keys(availableWallets).length === 0}
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
              {sendTxResponse && sendTxResponse.message && sendTxResponse.message.transactionHash &&
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
                  <strong>Payment Successful!</strong> You will be redirected in 10 seconds...
                </div>
              }
            </form>
          </>
        }
      </div>
    </div>
  )
};

export default Pay;
