# Conceal Cloud

> Work in progress...

### Usage

Requirements:
 - NodeJS (v10 or higher)

Optional requirements:
 - Yarn (installed globally)

#### Development

Clone repository:
```bash
git clone https://github.com/bomb-on/conceal.cloud
cd conceal.cloud

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
