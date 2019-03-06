import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead';
import QrReader from 'react-qr-reader';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { maskAddress } from '../../helpers/utils';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';


const SendModal = props => {
  const { appSettings, layout, user, userSettings, walletActions } = useContext(AppContext);
  const { coinDecimals, defaultFee, messageFee, feePerChar } = appSettings;
  const { sendTxResponse } = layout;
  const { toggleModal, wallet, ...rest } = props;

  const [qrReaderOpened, setQrReaderOpened] = useState(false);

  const { value: address, bind: bindAddress, reset: resetAddress } = useTypeaheadInput('');
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentIDValue, reset: resetPaymentID } = useFormInput('');
  const { value: amount, bind: bindAmount, setValue: setAmountValue, reset: resetAmount } = useFormInput('');
  const { value: message, bind: bindMessage, setValue: setMessageValue, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { value: label, bind: bindLabel, setValue: setLabelValue, reset: resetLabel } = useFormInput('');


  const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
  const totalMessageFee = message.length > 0 ? messageFee + message.length * feePerChar : 0;
  const txFee = parsedAmount > 0 || amount !== '' ? defaultFee : 0;
  const totalTxFee = txFee + totalMessageFee;
  const totalAmount = parsedAmount > 0 ? (parsedAmount + totalTxFee).toFixed(coinDecimals) : totalTxFee;
  const maxValue = totalTxFee > 0
    ? (wallet.balance - totalTxFee).toFixed(coinDecimals)
    : (wallet.balance - defaultFee).toFixed(coinDecimals);

  const walletBalanceValid = totalAmount <= wallet.balance;
  const messageAmountValid = totalMessageFee > 0 && totalTxFee.toFixed(coinDecimals) <= wallet.balance;
  const totalAmountValid = (parsedAmount.toFixed(coinDecimals) >= defaultFee && totalAmount > 0) || messageAmountValid;

  const formValidation = (
    address !== props.address &&
    address.length === 98 &&
    address.startsWith('ccx7') &&
    walletBalanceValid &&
    totalAmountValid && amount.toString().length <= 7 &&
    (paymentID === '' || paymentID.length === 64) &&
    (userSettings.twoFAEnabled
      ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
      : (password !== '' && password.length >= 8)
    )
  );
  const formValid = useFormValidation(formValidation);

  const calculateMax = () => setAmountValue(maxValue > 0 ? maxValue : 0);

  let addressInput = null;
  const handleScan = data => {
    if (data) {
      const [prefix, ...rest] = data.split(':');
      if (prefix === appSettings.qrCodePrefix) {
        const addressParams = rest.join(':').split('?');
        let event = new Event('input', { bubbles: true });
        addressInput.setState({ text: addressParams[0] });
        addressInput.props.onInputChange(addressParams[0], event);
        if (addressParams.length > 1) {
          const params = addressParams[1].split('&');
          params.forEach(p => {
            const param = p.split('=');
            if (param[0] === 'tx_amount') setAmountValue(param[1]);
            if (param[0] === 'tx_payment_id') setPaymentIDValue(param[1]);
            if (param[0] === 'tx_message') setMessageValue(param[1]);
            if (param[0] === 'tx_label') setLabelValue(param[1]);
          })
        }
      }
      setQrReaderOpened(false);
    }
  };

  const handleError = err => {
    console.error(err)
  };

  const formatOptions = {
    minimumFractionDigits: coinDecimals,
    maximumFractionDigits: coinDecimals,
  };

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgSendCoins"
      onHide={() => toggleModal('send')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Send CCX</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {qrReaderOpened &&
          <div className="width-100 mg-b-10">
            <QrReader
              className="qr-reader"
              delay={500}
              onError={handleError}
              onScan={handleScan}
            />
          </div>
        }

        <form
          className="send-form"
          onSubmit={e =>
            walletActions.sendTx(
              {
                e,
                wallet: props.address,
                address,
                paymentID,
                amount,
                message,
                twoFACode,
                password,
                label,
              },
              [
                resetAddress,
                resetPaymentID,
                resetAmount,
                resetMessage,
                resetTwoFACode,
                resetPassword,
                resetLabel,
              ],
            )
          }
        >
          <div className="form-layout form-layout-7">

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                From
              </div>
              <div className="col-7 col-sm-9 wallet-address">
                {props.address}
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                To
              </div>
              <div className="col-7 col-sm-9">
                <Typeahead
                  ref={component => addressInput = component ? component.getInstance() : addressInput}
                  {...bindAddress}
                  id="address"
                  labelKey="address"
                  options={user.addressBook}
                  placeholder="Address"
                  emptyLabel="No records in Address Book"
                  highlightOnlyResult
                  selectHintOnEnter
                  minLength={1}
                  renderMenuItemChildren={option =>
                    <>
                      <strong key="name">
                        {option.label}
                      </strong>
                      <div key="address">
                        <small>
                          Address: <code>{maskAddress(option.address)}</code>
                          {option.paymentID &&
                            <span> Payment ID: <code>{maskAddress(option.paymentID)}</code></span>
                          }
                        </small>
                      </div>
                    </>
                  }
                />
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Amount
              </div>
              <div className="col-7 col-sm-9">
                <div className="input-group">
                  <input
                    {...bindAmount}
                    size={2}
                    placeholder="Amount"
                    className="form-control"
                    name="amount"
                    type="number"
                    min={0}
                    max={maxValue}
                    step={Math.pow(10, -coinDecimals)}
                  />
                  <span className="input-group-btn">
                      <button className="btn btn-outline-secondary btn-max" onClick={calculateMax} type="button">
                        <small><strong>SEND MAX</strong></small>
                      </button>
                    </span>
                </div>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Payment ID (optional)
              </div>
              <div className="col-7 col-sm-9">
                <input
                  {...bindPaymentID}
                  size={6}
                  placeholder="Payment ID"
                  className="form-control"
                  name="paymentID"
                  type="text"
                  minLength={64}
                  maxLength={64}
                />
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Message (optional)
              </div>
              <div className="col-7 col-sm-9">
                <div className="input-group">
                  <input
                    {...bindMessage}
                    size={6}
                    placeholder="Message"
                    className="form-control"
                    name="message"
                    type="text"
                  />
                  <div className="input-group-append">
                      <span className="input-group-text">
                        <small>
                          <strong>
                            MESSAGE FEE: {(totalMessageFee).toLocaleString(undefined, formatOptions)} CCX
                          </strong>
                        </small>
                      </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                Label (optional)
              </div>
              <div className="col-7 col-sm-9">
                <input
                  {...bindLabel}
                  size={6}
                  placeholder="Label"
                  className="form-control"
                  name="label"
                  type="text"
                  minLength={1}
                />
              </div>
            </div>

            {userSettings.twoFAEnabled
              ? <div className="row no-gutters">
                  <div className="col-5 col-sm-3">
                    2 Factor Authentication
                  </div>
                  <div className="col-7 col-sm-9">
                    <input
                      {...bindTwoFACode}
                      size={6}
                      placeholder="2 Factor Authentication"
                      className="form-control"
                      name="twoFACode"
                      type="number"
                      minLength={6}
                      maxLength={6}
                    />
                  </div>
                </div>
              : <div className="row no-gutters">
                  <div className="col-5 col-sm-3">
                    Password
                  </div>
                  <div className="col-7 col-sm-9">
                    <input
                      {...bindPassword}
                      size={6}
                      placeholder="Password"
                      className="form-control"
                      name="password"
                      type="password"
                      minLength={8}
                    />
                  </div>
                </div>
            }
          </div>

          <hr />

          <div className="tx-total sendSection">
            <div className="tx-total-btns">
              <button
                type="submit"
                disabled={!formValid}
                className={`btn btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
              >
                SEND
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQrReaderOpened(!qrReaderOpened)}
              >
                SCAN QR CODE
              </button>
            </div>
            <span className="tx-right sendSummary">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalAmount > wallet.balance ? 'text-danger' : ''}`}>
                    {totalAmount.toLocaleString(undefined, formatOptions)} CCX
                  </span>
                </h2>
                <div>
                  <span className="tx-available-text">AVAILABLE</span>&nbsp;
                  <strong>
                    {wallet.balance && wallet.balance.toLocaleString(undefined, formatOptions)}
                  </strong> CCX
                </div>
                <div className="tx-default-fee-text">
                    MESSAGE FEE: {totalMessageFee.toLocaleString(undefined, formatOptions)} CCX
                </div>
                <div className="tx-default-fee-text">
                    TRANSACTION FEE: {defaultFee.toLocaleString(undefined, formatOptions)} CCX
                </div>
              </span>
          </div>
          {sendTxResponse &&
          <div className={`${sendTxResponse.status}-message`}>
            {
              sendTxResponse.status === 'error'
                ? <div className="text-danger">{sendTxResponse.message}</div>
                : <>
                    TX Hash: <a
                      href={`${appSettings.explorerURL}/?hash=${sendTxResponse.message.transactionHash}#blockchain_transaction`}
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
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('send')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default SendModal;
