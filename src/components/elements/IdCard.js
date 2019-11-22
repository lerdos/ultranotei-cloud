import React, { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';


const IdCard = props => {
  const { id, address, addressToCreate, name } = props.id;
  const { actions } = useContext(AppContext);
  const { deleteId } = actions;

  return (
    <Card key={`id-${address}`}>
      <Card.Header>
        <div className="row no-gutters">
          <div className="col-5 col-sm-4">
            <Accordion.Toggle as={Button} variant="link" eventKey={`id-${address}`}>
              <FontAwesomeIcon icon="caret-down" fixedWidth /> {name}
            </Accordion.Toggle>
          </div>
          <div className="col-7 col-sm-8 PaymentInfo">
            <div className="fa-pull-right">
              Address: {maskAddress(addressToCreate || address)}
            </div>
          </div>
        </div>
      </Card.Header>
      <Accordion.Collapse eventKey={`id-${address}`}>
        <Card.Body>
          <div className="form-layout form-layout-7">
            <dl className="row">
              <dt className="col-sm-2">Conceal ID:</dt>
              <dd className="col-sm-10">{id}.conceal.id</dd>
              <dt className="col-sm-2">Address:</dt>
              <dd className="col-sm-10">{address}</dd>
              {addressToCreate &&
                <>
                  <dt className="col-sm-2">Address to create:</dt>
                  <dd className="col-sm-10">{addressToCreate}</dd>
                </>
              }
              <dt className="col-sm-2">Name:</dt>
              <dd className="col-sm-10">{name}</dd>
            </dl>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                window.confirm(`You are about to delete ${name} ID. Proceed?`) &&
                deleteId({ id, address, addressToCreate, name })
              }}
            >
              Delete ID
            </button>
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default IdCard;
