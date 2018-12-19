import React, { Component, Fragment } from 'react';
import Modal from './Modal';
import AuthHelper from './AuthHelper';


class Wallet extends Component {

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
    const { address, amount, defaultFee, feePerChar, message, wallet } = this.state;
    const sendFormValid = (
      address.length === 98 &&
      address.startsWith('ccx7') &&
      amount.toString() !== '' &&
      amount > 0 &&
      (amount + defaultFee) + (message.length * feePerChar) <= wallet.balance &&
      wallet.balance
    );
    this.setState({ sendFormValid });
  };

  _toggleModal = (e) => {
    this.setState({ [`${e.target.name}Open`]: !this.state[`${e.target.name}Open`] });
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
          amount: '',
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
    const txIn = txs.length > 0 && wallet.transactions.filter(t => t.type === 'received');
    const txOut = txs.length > 0 && wallet.transactions.filter(t => t.type === 'sent');
    const balance = wallet.balance || 0;

    return (
      <div className="wallet">
        <div className="wallet-address">
          {wallet.address}
        </div>
        <div className="wallet-balance">
          <strong>{balance.toFixed(6)} CCX</strong>
        </div>
        <div className="wallet-txs">
          [
          {txs.length > 0
            ? <a href="#" name="detailsModal" onClick={this._toggleModal}>{txs.length} TXS</a>
            : "0 TXS"
          }
          {txIn && <small className="tx-received">{txIn.length} IN</small>}
          {txOut && <small className="tx-sent">{txOut.length} OUT</small>}
          ]
        </div>

        <button
          onClick={this._toggleModal}
          name="sendModal"
          className="wallet-button"
          disabled={balance === 0}
        >
          SEND
        </button>

        <button
          onClick={this._toggleModal}
          name="receiveModal"
          className="wallet-button"
        >
          RECEIVE
        </button>

        <Modal
          show={sendModalOpen}
          name="sendModal"
          onClose={this._toggleModal}
          title="Send CCX"
        >
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
                disabled={balance === 0}
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
                disabled={balance === 0}
                minLength={98}
                maxLength={98}
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
                disabled={balance === 0}
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
                disabled={balance === 0}
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
                    : <Fragment>
                        TX Hash: <a
                          href={`${explorerURL}/?hash=${sendResponse.message.transactionHash}#blockchain_transaction`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sendResponse.message.transactionHash}
                        </a><br />
                        Secret Key: {sendResponse.message.transactionSecretKey}
                      </Fragment>
                }
              </div>
            }
          </form>
        </Modal>

        <Modal
          show={receiveModalOpen}
          name="receiveModal"
          onClose={this._toggleModal}
          title="Receive CCX"
        >
          <div>Address: {wallet.address}</div>
          <div>QR Code...</div>
        </Modal>

        <Modal
          show={detailsModalOpen}
          name="detailsModal"
          onClose={this._toggleModal}
          title="Transaction History"
        >
          {txs.map(tx =>
            <div key={tx.hash} className={`tx tx-${tx.type}`}>
              <div className="tx-type">
                <strong>{tx.type === 'received' ? 'TX IN' : 'TX OUT'} ({tx.timestamp})</strong>
              </div>
              <div className="tx-hash">
                TX Hash:&nbsp;
                <a
                  href={`${explorerURL}/?hash=${tx.hash}#blockchain_transaction`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.hash}
                </a>
              </div>
              <div className="tx-amount">
                Amount: <strong>{tx.amount} CCX</strong>
              </div>
              <div className="tx-fee">
                Fee: <strong>{tx.fee} CCX</strong>
              </div>
              {/*{tx.address}*/}
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default Wallet;
