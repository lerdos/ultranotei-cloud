# Conceal Web Wallet

> Work in progress...

### Usage

Requirements:
 - NodeJS (v10 or higher)

Optional requirements:
 - Yarn (installed globally)

#### Development

Clone repository:
```bash
git clone https://github.com/bomb-on/wallet.conceal.network-front-end
cd wallet.conceal.network-front-end

# optional, checkout specific branch
# git checkout release/0.1.0
```

Install project dependencies:
```bash
yarn install
# or
# npm install
```

Run local development server:
```bash
yarn start
# or
# npm start
```

Build for deployment:
```bash
yarn build
# or
# npm run-script build
```

API endpoint can be overwritten with `REACT_APP_API_ENDPOINT` environmental variable:
```bash
export REACT_APP_API_ENDPOINT=http://blah/ && yarn build
# or
# export REACT_APP_API_ENDPOINT=http://blah/ && npm run-script build
```

#### Production

Run production npm script (not available yet):
```bash
npm run deploy
```

### TODO:

 - [ ] Resend verification email
 - [ ] Limit number of wallets (server side)
 - [ ] Export mnemonic seed
 - [ ] Decide how to handle tx secret key
 - [ ] Add deposits
 - [ ] Add investments
 - [X] Finish CSS
 - [ ] Handle API responses in ContextProvider
 - [ ] Add "get CCX" card
 - [ ] Add pool suggestion card
 - [ ] Address book
 - [ ] Add "buy/sell" option via STEX API?
 - [ ] Add pagination to details table
 - [x] Clear up forms and response messages
 - [X] Change user name, email and avatar in settings
 - [x] Fix mobile CSS
