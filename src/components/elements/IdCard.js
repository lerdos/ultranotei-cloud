import React, { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaCaretDown } from 'react-icons/fa';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';
import CopyButton from './CopyButton';


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
              <FaCaretDown /> {name}
            </Accordion.Toggle>
          </div>
          <div className="col-7 col-sm-8 PaymentInfo">
            <div className="fa-pull-right">
              {id}.conceal.id ({maskAddress(addressToCreate || address)})
            </div>
          </div>
        </div>
      </Card.Header>
      <Accordion.Collapse eventKey={`id-${address}`}>
        <Card.Body>
          <div className="form-layout form-layout-7">
            <div className="row no-gutters">
              <div className="col-5 col-sm-2">
                Conceal ID
              </div>
              <div className="col-7 col-sm-10">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    placeholder={`${id}.conceal.id`}
                    value={`${id}.conceal.id`}
                    readOnly
                  />
                  <div className="input-group-append">
                    <CopyButton text={`${id}.conceal.id`} toolTipText="Copy ID" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-5 col-sm-2">
                Address
              </div>
              <div className="col-7 col-sm-10">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    name="address"
                    placeholder={addressToCreate || address}
                    value={addressToCreate || address}
                    readOnly
                  />
                  <div className="input-group-append">
                    <CopyButton text={addressToCreate || address} toolTipText="Copy Address" />
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-outline-danger btn-sm mg-t-15"
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
