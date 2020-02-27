import React from 'react';

import { FormattedAmount, CCXExplorerLink, maskAddress } from '../../helpers/utils';


export const NewTxMessage = props => {
  const { tx } = props;
  return (
    <div>
      <div><small>{new Date(tx.timestamp).toLocaleString()}</small></div>
      <div>Amount: <FormattedAmount amount={tx.amount}/></div>
      <div>Wallet: {maskAddress(tx.address)}</div>
      <div>Hash: <CCXExplorerLink hash={maskAddress(tx.hash)}/></div>
      <div>Status: <strong>{tx.status.toUpperCase()}</strong></div>
    </div>
  )
};
