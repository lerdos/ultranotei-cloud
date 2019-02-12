import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DetailsModal = (props) => {
  const { appSettings, toggleModal, txs, ...rest } = props;

  return (
    <Modal
      { ...rest }
      size="lg"
      onHide={() => toggleModal('details')}
    >
      <Modal.Header closeButton>
        <Modal.Title>Wallet Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="list-group tx-details">
          {txs.map(tx =>
            <div key={tx.hash} className="list-group-item pd-y-20">
              <div className="media">
                <div className="d-flex mg-r-10 wd-50">
                  {tx.type === 'received'
                    ? <FontAwesomeIcon icon="arrow-up" className="text-success tx-icon" />
                    : <FontAwesomeIcon icon="arrow-down" className="text-danger tx-icon" />
                  }
                </div>
                <div className="media-body">
                  <small className="mg-b-10 tx-timestamp">{tx.timestamp}</small>
                  <p className="mg-b-5">
                    <span className="tx-amount">{tx.amount} CCX</span> <small className="tx-fee">FEE: {tx.fee}</small>
                  </p>
                  <p className="mg-b-5">
                    <a
                      href={`${appSettings.explorerURL}/?hash=${tx.hash}#blockchain_transaction`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tx.hash} <FontAwesomeIcon icon="external-link-alt" className="tx-link-icon" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => toggleModal('details')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default DetailsModal;
