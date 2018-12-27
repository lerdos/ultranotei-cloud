import React from 'react';

import AuthHelper from './AuthHelper';
import { maskAddress } from '../helpers/address';
import DetailsModal from './modals/Details';
import ReceiveModal from './modals/Receive';
import SendModal from './modals/Send';
import MdArrowUp from 'react-ionicons/lib/MdArrowUp';
import MdArrowDown from 'react-ionicons/lib/MdArrowDown';
import MdExpand from 'react-ionicons/lib/MdExpand';
import MdListBox from 'react-ionicons/lib/MdListBox';


class Wallet extends React.Component {

  Auth = new AuthHelper();

  constructor(props, context) {
    super(props, context);
    this.state = {
      coinDecimals: 5,
      detailsModalOpen: false,
      receiveModalOpen: false,
      sendModalOpen: false,
      wallet: {
        balance: null,
        locked: null,
        total: null,
        transactions: [],
      },
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

  _toggleModal = (modalName) => {
    this.setState({ [`${modalName}ModalOpen`]: !this.state[`${modalName}ModalOpen`] });
  };

  render() {
    const {
      coinDecimals,
      detailsModalOpen,
      explorerURL,
      receiveModalOpen,
      sendModalOpen,
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

        <SendModal
          show={sendModalOpen}
          toggleModal={this._toggleModal}
          explorerURL={explorerURL}
          wallet={wallet}
        />

        <ReceiveModal
          show={receiveModalOpen}
          toggleModal={this._toggleModal}
          wallet={wallet}
        />

        <DetailsModal
          show={detailsModalOpen}
          toggleModal={this._toggleModal}
          explorerURL={explorerURL}
          txs={txs}
        />
      </div>
    );
  }
}

export default Wallet;
