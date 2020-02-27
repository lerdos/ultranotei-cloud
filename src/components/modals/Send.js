import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Typeahead } from 'react-bootstrap-typeahead';
import QrReader from 'react-qr-reader';
import WAValidator from 'multicoin-address-validator';

import { AppContext } from '../ContextProvider';
import FormLabelDescription from '../elements/FormLabelDescription';
import WalletDropdown from '../elements/WalletDropdown';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { maskAddress } from '../../helpers/utils';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';


const SendModal = props => {
  const { actions, state } = useContext(AppContext);
  const { sendTx } = actions;
  const { appSettings, layout, user, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageFee, messageLimit } = appSettings;
  const { formSubmitted, sendTxResponse, walletsLoaded } = layout;
  const { toggleModal, wallet, ...rest } = props;

  const [availableWallets, setAvailableWallets] = useState({});
  const [selectedWallet, setSelectedWallet] = useState(wallet || {});
  const [walletAddress, setWalletAddress] = useState('');
  const [qrReaderOpened, setQrReaderOpened] = useState(false);

  const { value: address, bind: bindAddress, reset: resetAddress, paymentIDValue } = useTypeaheadInput('');
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentIDValue, reset: resetPaymentID } = useFormInput('');
  const { value: amount, bind: bindAmount, setValue: setAmountValue, reset: resetAmount } = useFormInput('');
  const { value: message, bind: bindMessage, setValue: setMessageValue, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { value: label, bind: bindLabel, setValue: setLabelValue, reset: resetLabel } = useFormInput('');

  const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
  const totalMessageFee = message.length > 0 ? messageFee : 0;
  const txFee = parsedAmount > 0 || amount !== '' ? defaultFee : 0;
  const totalTxFee = txFee + totalMessageFee;
  const totalAmount = parsedAmount > 0 ? (parsedAmount + totalTxFee).toFixed(coinDecimals) : totalTxFee;
  const maxValue = totalTxFee > 0
    ? (selectedWallet.balance - totalTxFee).toFixed(coinDecimals)
    : (selectedWallet.balance - defaultFee).toFixed(coinDecimals);

  const walletBalanceValid = totalAmount <= selectedWallet.balance;
  const messageAmountValid = totalMessageFee > 0 && totalTxFee <= selectedWallet.balance;
  const totalAmountValid = (parsedAmount >= defaultFee && totalAmount > 0) || messageAmountValid;

  useEffect(() => {
    if (paymentIDValue) setPaymentIDValue(paymentIDValue);
  }, [paymentIDValue, setPaymentIDValue]);

  const formValidation = (
    address !== props.address &&
    (WAValidator.validate(address, 'CCX') || new RegExp(/^[a-z0-9]*\.conceal\.id/).test(address)) &&
    walletBalanceValid &&
    totalAmountValid &&
    (message && message.length > 0 && message.length <= messageLimit) &&
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
            sendTx(
              {
                e,
                wallet: selectedWallet,
                address,
                paymentID,
                amount,
                message,
                twoFACode,
                password,
                label,
                id: 'sendForm',
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
                <FormLabelDescription>Address from which funds will be sent from</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9 wallet-address">
                {props.address ||
                  <WalletDropdown
                    availableWallets={availableWallets}
                    setWallet={setSelectedWallet}
                    setWalletAddress={setWalletAddress}
                    setAvailableWallets={setAvailableWallets}
                    walletAddress={walletAddress}
                    wallets={wallets}
                    walletsLoaded={walletsLoaded}
                  />
                }
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-5 col-sm-3">
                To
                <FormLabelDescription>Address to send funds to</FormLabelDescription>
              </div>
              <div className="col-7 col-sm-9">
                <Typeahead
                  ref={component => addressInput = component ? component.getInstance() : addressInput}
                  {...bindAddress}
                  id="address"
                  labelKey="address"
                  filterBy={['address', 'label', 'paymentID']}
                  options={user.addressBook}
                  placeholder="Address"
                  emptyLabel="No records in Address Book"
                  highlightOnlyResult
                  selectHintOnEnter
                  minLength={1}
                  renderMenuItemChildren={option =>
                    <>
                      <strong className="addrDropdownLabel" key="name">
                        {option.label}
                      </strong>
                      <div className="addrDropdownLabel" key="address">
                        <small>
                          Address: <span className="addrDropdownAddress">{maskAddress(option.address)}</span>
                          {option.paymentID &&
                            <span> ( Payment ID: <span className="addrDropdownAddress">{maskAddress(option.paymentID)}</span> )</span>
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
                <FormLabelDescription>Amount to send</FormLabelDescription>
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
                    step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
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
                <FormLabelDescription>Optional Payment ID for receiving address</FormLabelDescription>
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
                <FormLabelDescription>Optional message to include in this transaction</FormLabelDescription>
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
                    maxLength={messageLimit}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <small>
                        <strong>
                          {message.length}/{messageLimit} Characters
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
                <FormLabelDescription>
                  Add label to automatically add receiving address to Address Book
                </FormLabelDescription>
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
                    <FormLabelDescription>2 Factor Authentication code</FormLabelDescription>
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
                    <FormLabelDescription>Your password</FormLabelDescription>
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
                disabled={formSubmitted || !formValid}
                className={`btn btn-send ${formValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
              >
                {formSubmitted ? 'SENDING' : 'SEND'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQrReaderOpened(!qrReaderOpened)}
                disabled={formSubmitted}
              >
                SCAN QR CODE
              </button>
            </div>
            <span className="tx-right sendSummary">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalAmount > selectedWallet.balance ? 'text-danger' : ''}`}>
                    {totalAmount.toLocaleString(undefined, formatOptions)} CCX
                  </span>
                </h2>
                <div>
                  <span className="tx-available-text">AVAILABLE</span>&nbsp;
                  <strong>
                    {selectedWallet.balance && selectedWallet.balance.toLocaleString(undefined, formatOptions)}
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
