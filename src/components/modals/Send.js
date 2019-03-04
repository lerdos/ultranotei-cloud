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
  const address = useTypeaheadInput('');
  const paymentID = useFormInput('');
  const amount = useFormInput('');
  const message = useFormInput('');
  const twoFACode = useFormInput('');
  const password = useFormInput('');
  const label = useFormInput('');

  const parsedAmount = !Number.isNaN(parseFloat(amount.value)) ? parseFloat(amount.value) : 0;
  const totalMessageFee = message.value.length > 0 ? messageFee + message.value.length * feePerChar : 0;
  const txFee = parsedAmount > 0 || amount.value !== '' ? defaultFee : 0;
  const totalTxFee = txFee + totalMessageFee;
  const totalAmount = parsedAmount > 0 ? (parsedAmount + totalTxFee).toFixed(coinDecimals) : totalTxFee;
  const maxValue = totalTxFee > 0
    ? (wallet.balance - totalTxFee).toFixed(coinDecimals)
    : (wallet.balance - defaultFee).toFixed(coinDecimals);

  const walletBalanceValid = totalAmount <= wallet.balance;
  const messageAmountValid = totalMessageFee > 0 && totalTxFee.toFixed(coinDecimals) <= wallet.balance;
  const totalAmountValid = (parsedAmount.toFixed(coinDecimals) >= defaultFee && totalAmount > 0) || messageAmountValid;

  const formValidation = (
    address.value !== props.address &&
    address.value.length === 98 &&
    address.value.startsWith('ccx7') &&
    walletBalanceValid &&
    totalAmountValid && amount.value.toString().length <= 7 &&
    (paymentID.value === '' || paymentID.value.length === 64) &&
    (userSettings.twoFAEnabled
      ? (parseInt(twoFACode.value) && twoFACode.value.toString().length === 6)
      : (password.value !== '' && password.value.length >= 8)
    )
  );
  const formValid = useFormValidation(formValidation);

  const calculateMax = () => {
    const value = maxValue > 0 ? maxValue : 0;
    amount.onChange({ target: { value } });
  };

  const handleScan = data => {
    if (data) {
      const [prefix, ...rest] = data.split(':');
      if (prefix === 'conceal') {
        const addressParams = rest.join(':').split('?');
        address.onChange({ target: { value: addressParams[0] }});
        if (addressParams.length > 1) {
          const params = addressParams[1].split('&');
          params.forEach(param => {
            const splittedParams = param.split('=');
            const value = splittedParams[1];
            switch (splittedParams[0]) {
              case 'tx_amount':
                amount.onChange({ target: { value }});
                break;
              case 'tx_payment_id':
                paymentID.onChange({ target: { value }});
                break;
              case 'tx_message':
                message.onChange({ target: { value }});
                break;
              default:
                break;
            }
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
      { ...rest }
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
          onSubmit={e => walletActions.sendTx({
            e,
            wallet: props.address,
            address,
            paymentID,
            amount,
            message,
            twoFACode,
            password,
            label,
          })}
          className="send-form"
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
                  {...address}
                  id="address"
                  labelKey="address"
                  options={user.addressBook}
                  placeholder="Address"
                  emptyLabel="No records in Address Book"
                  highlightOnlyResult
                  selectHintOnEnter
                  minLength={1}
                  renderMenuItemChildren={option => {
                    return [
                      <strong key="name">
                        {option.label}
                      </strong>,
                      <div key="address">
                        <small>
                          Address: <code>{maskAddress(option.address)}</code>
                          {option.paymentID &&
                            <span> Payment ID: <code>{maskAddress(option.paymentID)}</code></span>
                          }
                        </small>
                      </div>,
                    ];
                  }}
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
                    {...amount}
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
                  {...paymentID}
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
                    {...message}
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
                  {...label}
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
                      {...twoFACode}
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
                      {...password}
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
