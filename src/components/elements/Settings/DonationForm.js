import React, { useEffect, useState, useContext } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import WAValidator from 'multicoin-address-validator';

import { AppContext } from '../../ContextProvider';
import { useFormInput, useFormValidation, useTypeaheadInput } from '../../../helpers/hooks';
import CopyButton from '../CopyButton';


const DonationForm = () => {
  const { state } = useContext(AppContext);
  const { appSettings, wallets } = state;

  const { value: donationWallet, bind: bindDonationWallet } = useTypeaheadInput('');
  const { value: recipientName, bind: bindRecipientName } = useFormInput('');
  const [donationHTML, setDonationHTML] = useState(null);
  const [donationURL, setDonationURL] = useState(null);

  const donationFormValid = useFormValidation(WAValidator.validate(donationWallet, 'CCX'));

  useEffect(() => {
    let url = appSettings.donationURL;
    if (donationWallet) url = `${url}/${donationWallet}`;
    if (donationWallet && recipientName) url = `${url}/${encodeURIComponent(recipientName)}`;
    if (donationWallet === '') url = null;
    let donateHTML = url
      ? `<a href="${url}" target="_blank">DONATE</a>`
      : null;
    setDonationHTML(donateHTML);
    setDonationURL(url);
  }, [donationWallet, recipientName]);

  const handleDonationURLFocus = event => event.target.firstChild
    ? event.target.firstChild.select()
    : event.target.select();

  return (
    <>
      <form>
        <div className="input-group donationInfo">
          <Typeahead
            {...bindDonationWallet}
            id="donationWallet"
            labelKey="donationWallet"
            options={Object.keys(wallets)}
            placeholder="Address"
            emptyLabel="No wallets available"
            highlightOnlyResult
            selectHintOnEnter
            minLength={1}
            bodyContainer
          />
          <input
            {...bindRecipientName}
            type="text"
            placeholder="Recipient Name"
            name="recipientName"
            className="form-control rbt-input-main"
            maxLength={64}
          />
        </div>
      </form>
      <div>
        {donationFormValid
          ? <div className="d-flex flex flex-column">
              <div>Use this URL as payment endpoint:</div>
              <div className="d-flex flex flex-row align-items-stretch">
                  <pre className="flex-1 paymentURL" onClick={handleDonationURLFocus}>
                    <input readOnly type="text" value={donationURL} />
                  </pre>
                <div>
                  <CopyButton text={donationURL} toolTipText="Copy URL" />
                </div>
              </div>
              <div>or use HTML code:</div>
              <div className="d-flex flex flex-row align-items-stretch">
                <pre className="flex-1 paymentURL" onClick={handleDonationURLFocus}>
                  <input readOnly type="text" value={donationHTML} />
                </pre>
                <div>
                  <CopyButton text={donationHTML} toolTipText="Copy HTML" />
                </div>
              </div>
            </div>
          : <>Add valid Conceal address to generate URL and HTML code.</>
        }
      </div>
    </>
  )
};

export default DonationForm;
