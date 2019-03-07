## Public url

https://trading-companies.herokuapp.com/

## Architecture

- no redux, but mutations contained within one class only - App. If redux was used, then there had not been a need to pass down event handlers to children components (they could manage this themselves)
- stress putted on easy to reason about, pure functions (i.e. helpers), used pure components
- no use of `let`s, no unnecessary mutations
- service worker not used, there was no apparent need to do so

## Todos

- add tests (unit and integration)
- would be good if the companies in ADDED COMPANIES had their data refreshed by some interval. It was not implemented because without this, the ACs seem to still be met.
- memoization of pure functions
- add timeout when inputting a symbol for company (for now there is no daley between keystrokes and requests to the APIs)
- change layout (current one is rather mock-upish, but still functional)
- remove the need for the native confirmation modal

## Environmental variables

For both production and development environments, `REACT_APP_ALPHAVANTAGE_API_KEY` must be set.

In production, two additional envs might be set:

`PORT` - on what port to run the app
`IP_THAT_CAN_SEE_SOURCE_MAPS`- IP that can access source maps (if not set, no-one can access source maps)

## To be noted

Please bear in mind that the app was created with the use of Create React App.
So some nodejs modules are already installed even if they are not listed in `package.json` (i.e. `eslint`, `babel-eslint`)

## How to run

First, please set up env variables.

### Development

```
1. yarn
2. yarn start
```

### Production

```
1. yarn
2. yarn build
3. node server.js
```
