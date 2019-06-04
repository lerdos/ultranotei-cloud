import React, { useContext, useEffect } from 'react';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';
import Button from 'react-bootstrap/Button';


const WalletDropdown = props => {
  const { actions } = useContext(AppContext);
  const { createWallet } = actions;

  const {
    availableWallets,
    setAvailableWallets,
    wallets,
    setWallet,
    walletAddress,
    setWalletAddress,
    walletsLoaded,
  } = props;


  useEffect(() => {
    const availableWallets = Object.keys(wallets)
      .reduce((acc, curr) => {
        if (wallets[curr].balance > 0) acc[curr] = wallets[curr];
        return acc;
      }, {});
    const selectedAddress = Object.keys(availableWallets)[0];
    const selectedWallet = wallets[selectedAddress];
    console.log(selectedAddress)
    if (selectedAddress && selectedWallet) {
      setWalletAddress(selectedAddress);
      setWallet(selectedWallet);
    }
    setAvailableWallets(availableWallets);
  }, [wallets]);

  return (
    <div>
      Balance too low. Send some funds to your wallet to process this payment.
    </div>
  )
};

export default WalletDropdown;
