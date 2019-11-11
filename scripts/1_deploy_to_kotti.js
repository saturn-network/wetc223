const ethers = require('ethers')
const inquirer = require('inquirer')
const fs = require('fs')
const _ = require('lodash')

const provider = new ethers.providers.JsonRpcProvider(
  'https://www.ethercluster.com/kotti', {
  chainId: 6,
  name: 'kotti'
})

async function deploy(w) {
  let wallet = w.connect(provider)
  let contractinfo = JSON.parse(fs.readFileSync('./artifacts/WETC223.json'))
  let abi = contractinfo.compilerOutput.abi
  let bytecode = contractinfo.compilerOutput.evm.bytecode.object
  let factory = new ethers.ContractFactory(abi, bytecode, wallet)

  let contract = await factory.deploy()
  console.log(`Deploying WETC223 contract ${contract.address} to Kotti testnet; tx ${contract.deployTransaction.hash}`)
  await contract.deployed()
  console.log('Done')
}

function getWallet() {
  let pkeyOrMnemonicPrompt = {
    type: 'list',
    name: 'usersecret',
    message: 'How would you like to access your wallet?',
    choices: ['Private Key', '12 Word Mnemonic']
  }

  inquirer.prompt(pkeyOrMnemonicPrompt).then(answers => {
    if (answers.usersecret === 'Private Key') {
      walletFromPkey()
    } else {
      walletFromMnemonic()
    }
  })
}

function walletFromPkey() {
  let pkeyinput = {
    type: 'password',
    message: 'Enter your Private Key',
    name: 'pkey'
  }

  inquirer.prompt(pkeyinput).then(async answers => {
    try {
      let wallet = new ethers.Wallet(answers.pkey)
      await deploy(wallet)
    } catch(e) {
      console.error(`Unable to connect to Kotti. Check that your private key is correct.`)
      walletFromPkey()
    }
  })
}

function walletFromMnemonic() {
  let mnemonicPrompt = {
    type: 'password',
    message: 'Enter your 12 Word Seed Phrase',
    name: 'mnemonic'
  }

  inquirer.prompt(mnemonicPrompt).then(answers => {
    let offsets = [...Array(10).keys()]
    try {
      let wallets = offsets.map(x => {
        return ethers.Wallet.fromMnemonic(answers.mnemonic, `m/44'/60'/0'/0/${x}`)
      })

      let selectWalletPrompt = {
        type: 'rawlist',
        message: 'Select wallet:',
        name: 'addy',
        choices: wallets.map(x => x.address)
      }
      inquirer.prompt(selectWalletPrompt).then(async answers => {
        let filtered = _.filter(wallets, x => x.address === answers.addy)
        let wallet = filtered[0]
        await deploy(wallet)
      })
    } catch(e) {
      console.error(`Unable to connect to Kotti. Check that your 12 word mnemonic is correct.`)
      walletFromMnemonic()
    }
  })
}


getWallet()
