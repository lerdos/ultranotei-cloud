import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';


const DetailsModal = (props) => {
  const { explorerURL, toggleModal, txs, ...rest } = props;

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
        <Button variant="secondary" onClick={() => toggleModal('details')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default DetailsModal;
