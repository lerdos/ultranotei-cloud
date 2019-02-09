import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AuthHelper from '../AuthHelper';


class SendModal extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
      address: '',
      amount: 0,
      coinDecimals: 5,
      defaultFee: 0.00001,
      feePerChar: 0.00001,
      message: '',
      paymentID: '',
      sendFormValid: false,
      sendResponse: null,
      wallet: props.wallet,
    };

    this.sendTx = this.sendTx.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const w = this.state.wallet;
    const { wallet } = nextProps;
    if (wallet.transactions.length !== w.transactions.length || wallet.balance !== w.balance) {
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
      address !== wallet.address &&
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

  _calculateMax = () => {
    const { coinDecimals, defaultFee, feePerChar, message, wallet } = this.state;
    const calculated = (wallet.balance - defaultFee - (message.length * feePerChar)).toFixed(coinDecimals);
    this.setState({ amount: parseFloat(calculated) }, () => this._validateForm());
  };

  sendTx(e, wallet, address, paymentID, amount, message) {
    this.setState({ sendResponse: null });
    e.preventDefault();
    fetch(`${this.state.apiEndpoint}/wallet`, {
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
        if (res.result === 'error' || res.message.error) {
          this.setState({
            sendResponse: {
              status: 'error',
              message: `Wallet Error: ${res.message.error ? res.message.error.message : res.message}`,
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
      defaultFee,
      feePerChar,
      message,
      paymentID,
      sendFormValid,
      sendResponse,
      wallet,
    } = this.state;
    const { explorerURL, toggleModal, ...rest } = this.props;

    const balance = wallet.balance || 0;

    let totalAmount = 0;
    if (message.length > 0) {
      totalAmount = amount + defaultFee + (message.length * feePerChar);
    } else {
      if (amount > 0) totalAmount = amount + defaultFee;
    }

    return (
      <Modal
        { ...rest }
        size="lg"
        onHide={() => toggleModal('send')}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send CCX</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => this.sendTx(e, wallet.address, address, paymentID, amount, message)}
            className="send-form"
          >
            <div className="form-layout form-layout-7">
              <div className="row no-gutters">
                <div className="col-5 col-sm-4">
                  From
                </div>
                <div className="col-7 col-sm-8 wallet-address">
                  {wallet.address}
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-5 col-sm-4">
                  To
                </div>
                <div className="col-7 col-sm-8">
                  <input
                    size={8}
                    placeholder="Address"
                    className="form-control"
                    name="address"
                    type="text"
                    minLength={98}
                    maxLength={98}
                    value={address}
                    onChange={this._handleChange}
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-5 col-sm-4">
                  Payment ID (optional)
                </div>
                <div className="col-7 col-sm-8">
                  <input
                    size={6}
                    placeholder="Payment ID"
                    className="form-control"
                    name="paymentID"
                    type="text"
                    minLength={64}
                    maxLength={64}
                    value={paymentID}
                    onChange={this._handleChange}
                  />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-5 col-sm-4">
                  Amount
                </div>
                <div className="col-7 col-sm-8">
                  <div className="input-group">
                    <input
                      size={2}
                      placeholder="Amount"
                      className="form-control"
                      name="amount"
                      type="number"
                      value={amount}
                      min={0}
                      max={balance - defaultFee}
                      step={0.00001}
                      onChange={this._handleChange}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-max" onClick={this._calculateMax} type="button">
                        <small><strong>SEND MAX</strong></small>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-5 col-sm-4">
                  Message (optional)
                </div>
                <div className="col-7 col-sm-8">
                  <div className="input-group">
                    <input
                      size={6}
                      placeholder="Message"
                      className="form-control"
                      name="message"
                      type="text"
                      value={message}
                      onChange={this._handleChange}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <small>
                          <strong>
                            FEE: {(message.length * feePerChar).toFixed(coinDecimals)} CCX
                          </strong>
                        </small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="tx-total">
              <Button
                type="submit"
                disabled={!sendFormValid}
                className="btn-send"
                variant={!sendFormValid ? 'outline-secondary' : 'outline-success'}
              >
                SEND
              </Button>
              <span className="tx-right">
                <h2>
                  <span className="tx-total-text">TOTAL</span>&nbsp;
                  <span className={`${totalAmount > balance ? 'text-danger' : ''}`}>
                    {totalAmount.toFixed(coinDecimals)} CCX
                  </span>
                </h2>
                <span className="tx-available-text">AVAILABLE</span> <strong>{balance.toFixed(coinDecimals)}</strong> CCX
              </span>
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
          <Button variant="outline-secondary" onClick={() => toggleModal('send')}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SendModal;
