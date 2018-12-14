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
      amount: '',
      address: '',
      message: '',
      isOpen: false,
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
    this.setState({ [e.target.name]: e.target.value });
  };

  _toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { amount, wallet, address, message } = this.state;
    const { sendTx } = this.props;

    const txs = wallet.transactions ? wallet.transactions.length : 0;
    const txIn = txs > 0 && wallet.transactions.filter(t => t.type === 'received');
    const txOut = txs > 0 && wallet.transactions.filter(t => t.type === 'sent');
    return (
      <div className="wallet">
        {wallet.address} [{wallet.balance} CCX] [{txs} TX{txIn && ` ${txIn.length} IN`}{txOut && ` ${txOut.length} OUT`}]

        <button
          onClick={this._toggleModal}
          disabled={!wallet.balance || parseInt(wallet.balance) === 0}
        >
          SEND CCX
        </button>

        <Modal
          show={this.state.isOpen}
          onClose={this._toggleModal}
        >
          <form onSubmit={(e) => sendTx(e, address, wallet.address, amount, message)}>
            Send&nbsp;
            <input
              size={2}
              placeholder="Amount"
              name="amount"
              type="number"
              disabled={!wallet.balance || parseInt(wallet.balance) === 0}
              value={amount}
              min={0}
              max={wallet.balance}
              onChange={this._handleChange}
            /> CCX to&nbsp;
            <input
              size={8}
              placeholder="Address"
              name="address"
              type="text"
              disabled={!wallet.balance || parseInt(wallet.balance) === 0}
              minLength={98}
              maxLength={98}
              value={address}
              onChange={this._handleChange}
            />
            <button
              type="submit"
              onClick={(e) => sendTx(e, wallet.address, address, amount, message)}
              disabled={!wallet.balance || wallet.balance === null || parseInt(wallet.balance) === 0}
            >
              Send
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default Wallet;
