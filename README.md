# Conceal Web Wallet

> Work in progress...

### Usage

General requirements:
 - NodeJS (v10 or higher)
 - Yarn (optional) installed globally

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

#### Production

Run production npm script (not available yet):
```bash
npm run deploy
```

### TODO:

 - [ ] Resend verification email
 - [x] Restore password
 - [x] Show txin/txout properly
 - [x] Show tx details
 - [x] Signup form validation
 - [x] Send form validation
 - [ ] Export private keys
 - [x] Limit number of wallets
 - [ ] Limit number of wallets (server side)
 - [x] Add tx date in details
 - [x] Add payment ID
 - [x] Ability to send a message with tx
 - [ ] Decide how to handle tx secret key
 - [ ] Add deposits
 - [ ] Add investments
 - [ ] Finish CSS
 - [ ] Fetch prices
