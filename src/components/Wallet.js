import React, { Component } from 'react';
import Modal from './Modal';


class Wallet extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      wallet: {
        transactions: [],
        balance: null,
        locked: null,
        total: null,
      },
      amount: 0,
      address: '',
      message: '',
      sendModalOpen: false,
      receiveModalOpen: false,
      detailsModalOpen: false,
      sendFormValid: false,
    };
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
    this.setState({ [e.target.name]: e.target.value }, () => this._validateForm());
  };

  _validateForm = () => {
    const { wallet, address, amount } = this.state;
    const sendFormValid = (
      wallet.balance &&
      amount <= wallet.balance &&
      amount > 0 &&
      amount.toString() !== '' &&
      address.length === 98 &&
      address.startsWith('ccx7')
    );
    this.setState({ sendFormValid });
  };

  _toggleModal = (e) => {
    this.setState({ [`${e.target.name}Open`]: !this.state[`${e.target.name}Open`] });
  };

  render() {
    const {
      amount,
      wallet,
      address,
      message,
      sendModalOpen,
      receiveModalOpen,
      detailsModalOpen,
      sendFormValid,
    } = this.state;
    const { sendTx } = this.props;

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
          {balance > 0
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
          disabled={balance === 0}
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
          <form onSubmit={(e) => sendTx(e, address, wallet.address, amount, message)} className="send-form">
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
              Amount:&nbsp;
              <input
                size={2}
                placeholder="Amount"
                name="amount"
                type="number"
                disabled={balance === 0}
                value={amount}
                min={0}
                max={balance}
                step={0.5}
                onChange={this._handleChange}
              /> CCX
            </div>
            <button
              type="submit"
              onClick={(e) => sendTx(e, wallet.address, address, amount, message)}
              disabled={!sendFormValid}
            >
              Send
            </button>
          </form>
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
                <strong>{tx.type === 'received' ? 'TX IN' : 'TX OUT'}</strong>
              </div>
              <div className="tx-hash">
                TX Hash:&nbsp;
                <a
                  href={`https://explorer.conceal.network/?hash=${tx.hash}#blockchain_transaction`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tx.hash}
                </a>
              </div>
              <div className="tx-amount">
                Amount: <strong>{tx.amount} CCX</strong>
              </div>
              {/*{tx.address}*/}
            </div>
          )}
        </Modal>

        <Modal
          show={receiveModalOpen}
          name="receiveModal"
          onClose={this._toggleModal}
          title="Receive CCX"
        >
          QR Code...
        </Modal>
      </div>
    );
  }
}

export default Wallet;
