import React, { useContext, useEffect, useState } from 'react';
import {AppContext} from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';
import {useFormInput, useFormValidation} from '../../helpers/hooks';


const Donate = props => {
  const { actions, state } = useContext(AppContext);
  const { appSettings, layout, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageFee, feePerChar } = appSettings;
  const { formSubmitted } = layout;

  const address = props.match.params.address;
  const recipientName = props.match.params.recipientName;

  const { value: amount, bind: bindAmount, reset: resetAmount } = useFormInput('');
  const { value: message, bind: bindMessage, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (Object.keys(wallets).length > 0 && (!wallet || Object.keys(wallets).length !== 0)) {
      setWallet(Object.values(wallets)[0]);
      setWalletAddress(Object.keys(wallets)[0]);
    }
  }, [wallets]);

  let formValidation = false;
  let maxValue = 0;

  if (wallet) {
    const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
    const totalMessageFee = message.length > 0 ? messageFee + message.length * feePerChar : 0;
    const txFee = parsedAmount > 0 || amount !== '' ? defaultFee : 0;
    const totalTxFee = txFee + totalMessageFee;
    const totalAmount = parsedAmount > 0 ? (parsedAmount + totalTxFee).toFixed(coinDecimals) : totalTxFee;
    maxValue = totalTxFee > 0
      ? (wallet.balance - totalTxFee).toFixed(coinDecimals)
      : (wallet.balance - defaultFee).toFixed(coinDecimals);

    const walletBalanceValid = totalAmount <= wallet.balance;
    const messageAmountValid = totalMessageFee > 0 && totalTxFee <= wallet.balance;
    const totalAmountValid = (parsedAmount >= defaultFee && totalAmount > 0) || messageAmountValid;

    formValidation = (
      // wallet.length === 98 &&
      // wallet.startsWith('ccx7') &&
      walletBalanceValid &&
      totalAmountValid &&
      (userSettings.twoFAEnabled
          ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
          : (password !== '' && password.length >= 8)
      )
    );
  }
  const formValid = useFormValidation(formValidation);

  return (
    <div class="donatePage">
		<div class="donateWrapper">
		  <h6 class="slim-pagetitle">Donate</h6>

		  <form
			onSubmit={e =>
			  actions.sendTx(
				{
				  e,
				  wallet: walletAddress,
				  address,
				  amount,
				  message,
				  twoFACode,
				  password,
				},
				[
				  resetAmount,
				  resetMessage,
				  resetTwoFACode,
				  resetPassword,
				],
			  )
			}
		  >
			<div class="row donateData">
				<div class="col-lg-12">
					<div class="form-layout form-layout-7">
						<div class="row no-gutters">
							<div class="col-5 col-sm-2">Donating to</div>
							<div class="col-7 col-sm-10 wallet-address">{address} {recipientName && `(${recipientName})`}</div>
						</div>
						<div class="row no-gutters">
							<div class="col-5 col-sm-2">From Wallet:</div>
							<div class="col-7 col-sm-10">
								<select
									className="form-control"								
									onChange={e => {
									setWallet(wallets[e.target.value]);
									setWalletAddress(e.target.value);
									}}
									value={walletAddress}
								>
									{Object.keys(wallets).map(address =>
									<option value={address} key={address} disabled={wallets[address].balance <= 0}>
										{maskAddress(address)} ({wallets[address].balance} CCX)
									</option>
									)}
								</select>						
							</div>
						</div>
						<div class="row no-gutters">
							<div class="col-5 col-sm-2">Amount</div>
							<div class="col-7 col-sm-10">
								<input
									{...bindAmount}
									size={2}
									className="form-control"								
									placeholder="Amount"
									name="amount"
									type="number"
									min={0}
									max={maxValue}
									step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
								/>
							</div>
						</div>
						<div class="row no-gutters">
							<div class="col-5 col-sm-2">Message</div>
							<div class="col-7 col-sm-10">
								<input
									{...bindMessage}
									size={6}
									className="form-control maxWidth"								
									placeholder="Message"
									name="message"
									type="text"
								/>					
							</div>
						</div>
						<div class="row no-gutters">
							{userSettings.twoFAEnabled
								? <>
									<div class="col-5 col-sm-2">2FA Code</div>
									<div class="col-7 col-sm-10">
										<input
										  {...bindTwoFACode}
										  size={6}
										  placeholder="2 Factor Authentication"
										  className="form-control maxWidth"								
										  name="twoFACode"
										  type="number"
										  minLength={6}
										  maxLength={6}
										/>
									</div>
								</>
								: <>
									<div class="col-5 col-sm-2">Password</div>
									<div class="col-7 col-sm-10">
										<input
										  {...bindPassword}
										  size={6}
										  className="form-control maxWidth"								
										  placeholder="Password"
										  name="password"
										  type="password"
										  minLength={8}
										/>
									</div>
								</>
							}
						</div>
					</div>
				</div>
			</div>

			<div>
			  <button
				type="submit"
				className="btn btn-outline-primary btn-uppercase-sm"
				disabled={formSubmitted || !formValid}
			  >
				SEND
			  </button>
			</div>
		  </form>
		</div>
	</div>
  )
};

export default Donate;
