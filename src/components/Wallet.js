import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import AuthHelper from './AuthHelper';
import { maskAddress } from '../helpers/address';
import MdArrowUp from 'react-ionicons/lib/MdArrowUp';
import MdArrowDown from 'react-ionicons/lib/MdArrowDown';
import MdExpand from 'react-ionicons/lib/MdExpand';
import MdListBox from 'react-ionicons/lib/MdListBox';


class Wallet extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      address: '',
      amount: 0,
      coinDecimals: 5,
      defaultFee: 0.00001,
      detailsModalOpen: false,
      explorerURL: 'https://explorer.conceal.network',
      feePerChar: 0.00001,
      message: '',
      paymentID: '',
      receiveModalOpen: false,
      sendFormValid: false,
      sendModalOpen: false,
      sendResponse: null,
      wallet: {
        balance: null,
        locked: null,
        total: null,
        transactions: [],
      },
    };

    this.sendTx = this.sendTx.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const w = this.state.wallet;
    const { wallet } = nextProps;
    if (wallet.transactions && (wallet.transactions.length !== w.transactions.length || wallet.balance !== w.balance)) {
      console.log(`updating wallet ${wallet.address}...`);
      this.setState({ wallet });
    }
  }

  _handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'amount') {
      val = e.target.value === '' ? 0 : parseFloat(e.target.value);
    }
    if (e.target.name) this.setState({ [e.target.name]: val }, () => this._validateForm());
  };

  _validateForm = () => {
    const { address, amount, defaultFee, feePerChar, message, paymentID, wallet } = this.state;
    const sendFormValid = !!(
      address.length === 98 &&
      address.startsWith('ccx7') &&
      amount.toString() !== '' &&
      amount > 0 &&
      (amount + defaultFee) + (message.length * feePerChar) <= wallet.balance &&
      (paymentID === '' || (paymentID !== '' && paymentID.length === 64)) &&
      wallet.balance
    );
    this.setState({ sendFormValid });
  };

  _toggleModal = (modalName) => {
    this.setState({ [`${modalName}ModalOpen`]: !this.state[`${modalName}ModalOpen`] });
  };

  _calculateMax = () => {
    const { coinDecimals, defaultFee, feePerChar, message, wallet } = this.state;
    const calculated = (wallet.balance - defaultFee - (message.length * feePerChar)).toFixed(coinDecimals);
    this.setState({ amount: parseFloat(calculated) }, () => this._validateForm());
  };

  sendTx(e, wallet, address, paymentID, amount, message) {
    this.setState({ sendResponse: null });
    e.preventDefault();
    fetch(`http://wallet.conceal.network/api/wallet`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Token': this.Auth.getToken(),
      },
      body: JSON.stringify({
        address,  // destination
        amount: parseFloat(amount),
        message,
        paymentID,
        wallet,  // origin
      }),
    })
      .then(r => r.json())
      .then(res => {
        console.log(res);
        if (res.result === 'error' || res.message.error) {
          this.setState({
            sendResponse: {
              status: 'error',
              message: `Wallet Error: ${res.message}`,
            },
          });
          return;
        }
        this.setState({
          address: '',
          amount: 0,
          message: '',
          paymentID: '',
          sendFormValid: false,
          sendResponse: {
            status: 'success',
            message: res.message.result,
          },
        });
      });
  }

  render() {
    const {
      address,
      amount,
      coinDecimals,
      detailsModalOpen,
      defaultFee,
      explorerURL,
      feePerChar,
      message,
      paymentID,
      receiveModalOpen,
      sendFormValid,
      sendModalOpen,
      sendResponse,
      wallet,
    } = this.state;

    const txs = wallet.transactions || [];
    const txIn = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'received') : [];
    const txOut = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'sent') : [];
    const balance = wallet.balance || 0;

    return (
      <div className="list-group-item">
        {wallet.address &&
          <>
            <div className="user-name-address">
              <p>{maskAddress(wallet.address)}</p>
              <span>Available Balance: {balance.toFixed(coinDecimals)} CCX</span>
              <span>Transactions in: {txIn.length}</span>
              <span>Transactions out: {txOut.length}</span>
            </div>
            <div className="user-btn-wrapper">
              <button
                onClick={() => this._toggleModal('send')}
                className="btn btn-outline-light btn-icon"
                disabled={balance === 0}
              >
                <MdArrowUp className="icon" color="#868ba1" />
              </button>
              <button
                className="btn btn-outline-light btn-icon"
                onClick={() => this._toggleModal('receive')}
              >
                <MdArrowDown className="icon" color="#868ba1" />
              </button>
              <button
                className="btn btn-outline-light btn-icon"
              >
                <MdExpand className="icon" color="#868ba1" />
              </button>
              <button
                className="btn btn-outline-light btn-icon"
                onClick={() => this._toggleModal('details')}
              >
                <MdListBox className="icon" color="#868ba1" />
              </button>
            </div>
          </>
        }

        <Modal
          size="lg"
          show={sendModalOpen}
          onHide={() => this._toggleModal('send')}
        >
          <Modal.Header closeButton>
            <Modal.Title>Send CCX</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            From: <span className="wallet-address">{wallet.address}</span>
            <form
              onSubmit={(e) => this.sendTx(e, wallet.address, address, paymentID, amount, message)}
              className="send-form"
            >
              <div>
                To:&nbsp;
                <input
                  size={8}
                  placeholder="Address"
                  name="address"
                  type="text"
                  minLength={98}
                  maxLength={98}
                  value={address}
                  onChange={this._handleChange}
                />
              </div>
              <div>
                Payment ID (optional):&nbsp;
                <input
                  size={6}
                  placeholder="Payment ID"
                  name="paymentID"
                  type="text"
                  minLength={64}
                  maxLength={64}
                  value={paymentID}
                  onChange={this._handleChange}
                />
              </div>
              <div>
                Amount:&nbsp;
                <input
                  size={2}
                  placeholder="Amount"
                  name="amount"
                  type="number"
                  value={amount}
                  min={0}
                  max={balance - defaultFee}
                  step={0.00001}
                  onChange={this._handleChange}
                /> CCX&nbsp;
                <button onClick={this._calculateMax} type="button" className="wallet-button">
                  Send Max. Amount
                </button>
              </div>
              <div>
                Message (optional):&nbsp;
                <input
                  size={6}
                  placeholder="Message"
                  name="message"
                  type="text"
                  value={message}
                  onChange={this._handleChange}
                />
                <br />
                <small>Msg fee: {message.length > 0 ? (message.length * feePerChar).toFixed(coinDecimals) : 0} CCX</small>
              </div>
              <button
                type="submit"
                disabled={!sendFormValid}
              >
                Send
              </button>
              <div>
                <strong>
                  TOTAL: {message.length > 0
                  ? (amount + defaultFee + (message.length * feePerChar)).toFixed(coinDecimals)
                  : (amount + defaultFee).toFixed(coinDecimals)
                } CCX
                </strong> (Available: {balance.toFixed(coinDecimals)} CCX)
              </div>
              {sendResponse &&
              <div className={`${sendResponse.status}-message`}>
                {
                  sendResponse.status === 'error'
                    ? sendResponse.message
                    : <>
                      TX Hash: <a
                        href={`${explorerURL}/?hash=${sendResponse.message.transactionHash}#blockchain_transaction`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sendResponse.message.transactionHash}
                      </a><br />
                      Secret Key: {sendResponse.message.transactionSecretKey}
                    </>
                }
              </div>
              }
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this._toggleModal('send')}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          show={receiveModalOpen}
          onHide={() => this._toggleModal('receive')}
        >
          <Modal.Header closeButton>
            <Modal.Title>Receive CCX</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Address: {wallet.address}</div>
            <div>QR Code...</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this._toggleModal('receive')}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="lg"
          show={detailsModalOpen}
          onHide={() => this._toggleModal('details')}
        >
          <Modal.Header closeButton>
            <Modal.Title>Wallet Transactions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {txs.map(tx =>
              <div key={tx.hash}>
                <div>
                  <strong>{tx.type === 'received' ? 'TX IN' : 'TX OUT'} ({tx.timestamp})</strong>
                </div>
                <div>
                  TX Hash:&nbsp;
                  <a
                    href={`${explorerURL}/?hash=${tx.hash}#blockchain_transaction`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash}
                  </a>
                </div>
                <div>
                  Amount: <strong>{tx.amount} CCX</strong>
                </div>
                <div>
                  Fee: <strong>{tx.fee} CCX</strong>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this._toggleModal('details')}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Wallet;
