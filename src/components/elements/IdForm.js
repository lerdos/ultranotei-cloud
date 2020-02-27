import React, { useContext, useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import WAValidator from 'multicoin-address-validator';
import { FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

import { AppContext } from '../ContextProvider';
import { useDebounce, useFormInput, useFormValidation } from '../../helpers/hooks';
import WalletInput from './WalletInput';
import FormLabelDescription from './FormLabelDescription';


const IdForm = () => {
  const { actions, state } = useContext(AppContext);
  const { appSettings, layout, wallets } = state;
  const { formSubmitted } = layout;
  const { checkId, createId } = actions;

  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [idAddress, setIdAddress] = useState(false);
  const { value: idValue, bind: bindIdValue, reset: resetId } = useFormInput('');
  const { value: idName, bind: bindIdName, reset: resetName } = useFormInput('');
  const { value: idAddressToCreate, bind: bindIdAddressToCreate, reset: resetIdAddressToCreate } = useFormInput('');

  const debouncedSearchTerm = useDebounce(idValue, 750);

  useEffect(() => {
    if (debouncedSearchTerm && idValue && idValue.length > 2) {
      setIsSearching(true);
      checkId(debouncedSearchTerm).then(() => {
        setIsSearching(false);
        setIsTyping(false);
      });
    }
  }, [debouncedSearchTerm]);

  const idFormValidation = (
    idAddress &&
    wallets[idAddress] &&
    wallets[idAddress].balance >= (appSettings.idFee + appSettings.defaultFee) &&
    layout.idAvailable &&
    !isSearching &&
    !isTyping &&
    idValue.length >= 2 &&
    idValue.length <= 32 &&
    idName.length >= 3 &&
    (idAddressToCreate === '' || (idAddressToCreate !== '' && WAValidator.validate(idAddressToCreate, 'CCX')))
  );
  const idFormValid = useFormValidation(idFormValidation);

  return (
    <form
      className="send-form"
      onSubmit={e =>
        createId(
          {
            e,
            idAddress,
            idAddressToCreate,
            idName,
            idValue,
            id: 'idForm',
          },
          [
            resetId,
            resetIdAddressToCreate,
            resetName,
          ],
        )
      }
    >
      <div className="form-layout form-layout-7">
        <div className="row no-gutters">
          <div className="col-5 col-sm-4">
            Conceal ID
            <FormLabelDescription>
              ID you wish to use. If you choose "myname", your Conceal ID will be "myname.conceal.id".
            </FormLabelDescription>
          </div>
          <div className="col-7 col-sm-8 wallet-address">
            <div className="input-group">
              <input
                {...bindIdValue}
                type="text"
                placeholder="Conceal ID"
                name="id"
                className="form-control"
                onKeyDown={e => e.keyCode !== 9 && setIsTyping(true)}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  {isSearching && <FaSpinner className="faa-spin animated" />}
                  {idValue.length > 2 && !isSearching && !isTyping && (
                      layout.idAvailable
                      ? <OverlayTrigger overlay={<Tooltip id="id-available">ID Available</Tooltip>}>
                          <FaCheck className="text-success" />
                        </OverlayTrigger>
                      : <OverlayTrigger overlay={<Tooltip id="id-not-available">ID Not Available</Tooltip>}>
                          <FaExclamationTriangle className="text-danger" />
                        </OverlayTrigger>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row no-gutters">
          <div className="col-5 col-sm-4">
            <div>
              Payment Address
              <FormLabelDescription>
                One of your Cloud addresses with enough funds to pay the fee. By default, this address will be used
                to bind your ID to. If you want to bind different address, add it to "ID Address" field below.
              </FormLabelDescription>
            </div>
          </div>
          <div className="col-7 col-sm-8 wallet-address">
            <WalletInput
              emptyLabel="No wallets found."
              filterBy={['address']}
              hideAddon={true}
              placeholder="Payment Address"
              setAddress={setIdAddress}
              wallets={
                Object.keys(wallets).reduce((a, address) => {
                  if (wallets[address].balance > 0) a.push({ address });
                  return a;
                }, [])
              }
            />
          </div>
        </div>

        <div className="row no-gutters">
          <div className="col-5 col-sm-4">
            <div>
              ID Address (Optional)
              <FormLabelDescription>
                Optional address to bind ID to. If left blank, the Payment Address above will be binded to ID.
              </FormLabelDescription>
            </div>
          </div>
          <div className="col-7 col-sm-8 wallet-address">
            <input
              {...bindIdAddressToCreate}
              type="text"
              placeholder="ID Address"
              name="idAddressToCreate"
              className="form-control rbt-input-main"
            />
          </div>
        </div>

        <div className="row no-gutters">
          <div className="col-5 col-sm-4">
            ID Label
            <FormLabelDescription>
              Label for this ID.
            </FormLabelDescription>
          </div>
          <div className="col-7 col-sm-8 wallet-address">
            <input
              {...bindIdName}
              type="text"
              placeholder="ID Label"
              name="idName"
              className="form-control rbt-input-main"
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="tx-total sendSection">
        <div className="tx-total-btns">
          <button
            type="submit"
            disabled={formSubmitted || !idFormValid}
            className={`btn btn-send ${idFormValid ? 'btn-outline-success' : 'btn-outline-danger'}`}
          >
            {formSubmitted ? 'SENDING' : 'SEND'}
          </button>
        </div>
        <span className="tx-right sendSummary">
          Creating new ID has a fixed fee of <strong className="tx-danger"><u>{20 + appSettings.defaultFee} CCX</u></strong>.
          By submitting the form, the amount will be deducted from your selected wallet's balance.
        </span>
      </div>
    </form>
  );
};

export default IdForm;
