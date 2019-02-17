import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from './ContextProvider';
import { maskAddress } from '../helpers/utils';
import SendModal from './modals/Send';
import ReceiveModal from './modals/Receive';
import DetailsModal from './modals/Details';
import KeysModal from './modals/Keys';


const Wallet = (props) => {
  const { appSettings, walletActions, wallets } = useContext(AppContext);
  const { coinDecimals } = appSettings;

  const [sendModalOpen, toggleSendModal] = useState(false);
  const [receiveModalOpen, toggleReceiveModal] = useState(false);
  const [detailsModalOpen, toggleDetailsModal] = useState(false);
  const [keysModalOpen, toggleKeysModal] = useState(false);

  const wallet = wallets[props.address];

  const txs = wallet.transactions || [];
  const txIn = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'received') : [];
  const txOut = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'sent') : [];
  const balance = wallet.balance || 0;

  return (
    <div className="list-group-item">
      <>
        <div className="user-name-address">
          <p>{maskAddress(props.address)}</p>
          <span>Available Balance: {balance.toFixed(coinDecimals)} CCX</span>
          <span>Transactions in: {txIn.length}</span>
          <span>Transactions out: {txOut.length}</span>
        </div>
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-dark ${balance === 0 ? 'disabled' : ''}`}
            onClick={() => toggleSendModal(!sendModalOpen)}
            disabled={balance === 0}
          >
            <FontAwesomeIcon icon="arrow-up" fixedWidth />
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => toggleReceiveModal(!receiveModalOpen)}
          >
            <FontAwesomeIcon icon="arrow-down" fixedWidth />
          </button>
          <button
            className={`btn btn-outline-dark ${txs.length === 0 ? 'disabled' : ''}`}
            onClick={() => toggleDetailsModal(!detailsModalOpen)}
            disabled={txs.length === 0}
          >
            <FontAwesomeIcon icon="list-alt" fixedWidth />
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              toggleKeysModal(!keysModalOpen);
              walletActions.getWalletKeys(props.address);
            }}
          >
            <FontAwesomeIcon icon="key" fixedWidth />
          </button>
        </div>

        <SendModal
          {...props}
          show={sendModalOpen}
          toggleModal={() => toggleSendModal(!sendModalOpen)}
          wallet={wallet}
        />

        <ReceiveModal
          {...props}
          show={receiveModalOpen}
          toggleModal={() => toggleReceiveModal(!receiveModalOpen)}
        />

        <DetailsModal
          {...props}
          show={detailsModalOpen}
          toggleModal={() => toggleDetailsModal(!detailsModalOpen)}
          wallet={wallet}
        />

        <KeysModal
          {...props}
          show={keysModalOpen}
          toggleModal={() => toggleKeysModal(!keysModalOpen)}
          wallet={wallet}
        />
      </>
    </div>
  )
};

export default Wallet;
