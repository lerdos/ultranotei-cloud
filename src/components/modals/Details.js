import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../ContextProvider';


const DetailsModal = props => {
  const { toggleModal, wallet, ...rest } = props;
  const { appSettings } = useContext(AppContext);

  const formatOptions = {
    minimumFractionDigits: appSettings.coinDecimals,
    maximumFractionDigits: appSettings.coinDecimals,
  };

  return (
    <Modal
      {...rest}
      size="lg"
      id="dlgTxDetails"
      onHide={() => toggleModal('details')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Wallet Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-group tx-details">
          {wallet.transactions && wallet.transactions
            .sort((a, b) => (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
            .map(tx =>
              <div key={tx.hash} className="list-group-item pd-y-20">
                <div className="media">
                  <div className="d-flex mg-r-10 wd-50">
                    {tx.type === 'received'
                      ? <FontAwesomeIcon icon="arrow-down" className="text-success tx-icon" />
                      : <FontAwesomeIcon icon="arrow-up" className="text-danger tx-icon" />
                    }
                  </div>
                  <div className="media-body">
                    <small className="mg-b-10 tx-timestamp"><Moment>{tx.timestamp}</Moment></small>
                    <p className="mg-b-5">
                      <span className="tx-amount">{tx.amount.toLocaleString(undefined, formatOptions)} CCX</span>&nbsp;
                      <small className="tx-fee">FEE: {tx.fee.toLocaleString(undefined, formatOptions)}</small>
                    </p>
                    <p className="mg-b-5">
                      <a
                        href={`${appSettings.explorerURL}/index.html?hash=${tx.hash}#blockchain_transaction`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tx.hash} <FontAwesomeIcon icon="external-link-alt" className="tx-link-icon" />
                      </a>
                    </p>
                    {tx.status === 'pending' &&
                      <p className="tx-pending">
                        [PENDING]
                      </p>
                    }
                  </div>
                </div>
              </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={() => toggleModal('details')}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default DetailsModal;
