#!/bin/bash

if [[ "$1" != "staging" && "$1" != "live" ]]; then
    echo "Please specify what to deploy: staging, live"
    exit 1;
fi

if [[ "$2" == "" ]]; then
    echo "Please specify release branch/tag name"
    exit 1;
fi

if [[ "$3" == "" ]]; then
    echo "Please specify api endpoint like https://api.wallet.conceal.network/api"
    exit 1;
fi

#npm install
#export REACT_APP_API_ENDPOINT="$3" && npm run-script build

if [[ "$1" == "live" ]]; then
    DOMAIN="conceal.cloud"
    DISTR="E1GRNOKTY1DVG"

    # Checkout the branch
    git fetch
    git checkout $2

    if [ $? -eq 0 ]; then
        echo "Checkout of $3 successful"
    else
        echo "Branch/tag doesn't exist"
        exit 1;
    fi

    # Fetch branch changes
    git pull origin $2
fi

if [[ "$1" == "staging" ]]; then
    DOMAIN="staging.conceal.cloud"
fi

aws s3 rm s3://$DOMAIN/ --recursive
aws s3 cp ./build s3://$DOMAIN/ --recursive

if [ -z "$DISTR" ]
then
      echo "Cloudfront invalidation not necessary"
else
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id $DISTR --paths /
	aws cloudfront create-invalidation --distribution-id $DISTR --paths /index.html
fi


echo "Sucessfully deployed to $DOMAIN"
exit 0;
