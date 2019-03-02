import React, { useState, useContext } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from './ContextProvider';
import { maskAddress } from '../helpers/utils';
import SendModal from './modals/Send';
import ReceiveModal from './modals/Receive';
import DetailsModal from './modals/Details';
import KeysModal from './modals/Keys';


const Wallet = (props) => {
  const { appSettings, walletActions, wallets } = useContext(AppContext);

  const [sendModalOpen, toggleSendModal] = useState(false);
  const [receiveModalOpen, toggleReceiveModal] = useState(false);
  const [detailsModalOpen, toggleDetailsModal] = useState(false);
  const [keysModalOpen, toggleKeysModal] = useState(false);

  const wallet = wallets[props.address];

  const txs = wallet.transactions || [];
  const txIn = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'received') : [];
  const txOut = txs.length > 0 ? wallet.transactions.filter(t => t.type === 'sent') : [];
  const locked = wallet.locked || 0;
  const balanceTotal = wallet.total || 0;

  const formatOptions = {
    minimumFractionDigits: appSettings.coinDecimals,
    maximumFractionDigits: appSettings.coinDecimals,
  };

  return (
    <div className="list-group-item">
      <div className="user-name-address">
        <p>{maskAddress(props.address)}</p>
        <span>
          Balance: {balanceTotal.toLocaleString(undefined, formatOptions)} CCX&nbsp;
          {locked > 0 &&
            <span className="tx-pending d-inline-block">
              (Locked: {locked.toLocaleString(undefined, formatOptions)})
            </span>
          }
        </span>
        <span>Transactions in: {txIn.length}</span>
        <span>Transactions out: {txOut.length}</span>
      </div>
      <div className="btn-group" role="group">
        <OverlayTrigger overlay={<Tooltip id={`${props.address}-send`} trigger={['hover']}>Send CCX</Tooltip>}>
          <button
            {...props}
            className={`btn btn-outline-dark ${balanceTotal === 0 ? 'disabled' : ''}`}
            onClick={() => toggleSendModal(!sendModalOpen)}
            disabled={balanceTotal === 0}
          >
            <FontAwesomeIcon icon="arrow-up" fixedWidth />
          </button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip id={`${props.address}-receive`} trigger={['hover']}>Receive CCX</Tooltip>}>
          <button
            className="btn btn-outline-dark"
            onClick={() => toggleReceiveModal(!receiveModalOpen)}
          >
            <FontAwesomeIcon icon="arrow-down" fixedWidth />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-txs`} trigger={['hover']}>Transactions</Tooltip>}>
          <button
            className={`btn btn-outline-dark ${txs.length === 0 ? 'disabled' : ''}`}
            onClick={() => toggleDetailsModal(!detailsModalOpen)}
            disabled={txs.length === 0}
          >
            <FontAwesomeIcon icon="list-alt" fixedWidth />
          </button>
        </OverlayTrigger>

        <OverlayTrigger overlay={<Tooltip id={`${props.address}-keys`} trigger={['hover']}>Export Keys</Tooltip>}>
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              toggleKeysModal(!keysModalOpen);
              walletActions.getWalletKeys(props.address);
            }}
          >
            <FontAwesomeIcon icon="key" fixedWidth />
          </button>
        </OverlayTrigger>
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
    </div>
  )
};

export default Wallet;
