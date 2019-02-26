#!/bin/bash

export REACT_APP_API_ENDPOINT="https://api.wallet.conceal.network/api" && npm run-script build

DOMAIN="wallet.conceal.network"

aws s3 rm s3://$DOMAIN/ --recursive
aws s3 cp ./build s3://$DOMAIN/ --recursive

aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id EPW18WLSUWHMU --paths /
aws cloudfront create-invalidation --distribution-id EPW18WLSUWHMU --paths /index.html

echo "Sucessfully deployed to $DOMAIN"
exit 0;
