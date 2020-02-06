import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CCXAmount, CCXExplorerLink } from '../../helpers/utils';


const DetailsModal = props => {
  const { toggleModal, wallet, ...rest } = props;

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
                      <span className="tx-amount"><CCXAmount amount={tx.amount} /></span>&nbsp;
                      <small className="tx-fee">FEE: <CCXAmount amount={tx.fee} /></small>
                    </p>
                    <p className="mg-b-5">
                      <CCXExplorerLink hash={tx.hash} />
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
