# WETC Bounty

Built with [Saturn Dapp Dev Kit](https://www.saturn.network/blog/ethereum-dapp-development-kit/)!

Based on [ETC Labs Gitcoin bounty](https://gitcoin.co/issue/etclabscore/WrappedETC/1/3618), but implements wrapped Ethereum as the better [ERC223 standard](https://www.saturn.network/blog/advantages-of-erc223-tokens/) instead of ERC20.

This code could have earned you $1,500 for that bounty! Check deployed version [here](https://explorer.jade.builders/address/0x40683573E0d2C592f47fAb55F980e0Bd51CEc5Ab?network=kotti).

> Don't have time to learn tech and want to focus on making your business successful? [**We can help!**](https://forms.gle/QjtUYcbttCeyUfK48)

## Usage

Make sure you have [node.js installed](https://forum.saturn.network/t/how-to-install-hyper-node-js/4054). Also, download and run [Ganache](https://truffleframework.com/ganache) - your private testnet for smart contract development.

Then, in the terminal in the folder where you downloaded this git repo, run

```sh
# install dependencies
npm install

# to run tests, do
npm run test

# to build the project for release, run
npm run sol-compiler

# after that, to deploy WETC223 to Kotti, run
node scripts/1_deploy_to_kotti.js
```


## Most interesting files to review

1. `contracts/ERC223.sol` - this is the ERC223 token interface that we use ourselves for [STRN](https://www.saturn.network/exchange/ETC/order-book/STRN).
2. `test/wetc223.js` - this shows how to interact with this token, as well as tests for edge cases (e.g. ensure that balance of the token and collateral is always in sync).
3. `compiler.json` - this is a configuration file for the `sol-compiler` tool, it allows you to select which smart contract you want to build for production usage.
3. `scripts/1_deploy_to_kotti.js` - this file shows how to deploy your created and compiled smart contract onto the [Kotti testnet](https://www.saturn.network/blog/goerli-and-kotti-cross-client-ethereum-testnets/).
