import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
import ProviderSubprovider from 'web3-provider-engine/subproviders/provider';
import EthereumJsWallet from 'ethereumjs-wallet'

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
  },
];

function getWeb3Instance() {
    const wallet = EthereumJsWallet.fromPrivateKey(Buffer.from('0ec9fd35107767a69ba201585ecb8e8990f669fa29e7bc66c449f712266d490f', 'hex'));
    const engine = new ProviderEngine();

    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new ProviderSubprovider(new Web3.providers.HttpProvider(
        `https://ropsten.infura.io/v3/f29bb696c2d04dd9b43a9346d3cdc58b`)));

    engine.start();

    const web3 = new Web3(engine);

    web3.eth.defaultAccount = wallet.getAddressString();

    return web3;
  }
const contractAddress = '0x86CB2F78beE8160965c852CfBf84B472d9953b68'
const decimals = 4
const web3 = getWeb3Instance()

 const getERC20Balance = (web3) => {
    const walletAddress = '0x11dB4495b9d866B051eCf15f35F11e68364Dae18'

    return new Promise((resolve, reject) => {
      web3.eth
        .contract(erc20Abi)
        .at(contractAddress)
        .balanceOf(walletAddress, (error, decimalsBalance) => {
          if (error) {
            reject(error);
          }
          const balance = decimalsBalance / Math.pow(10, decimals);
          resolve(balance);
        });
    });
}
const sendERC20Transaction = (toAddress, amount) => {

  return new Promise((resolve, reject) => {
    web3.eth
      .contract(erc20Abi)
      .at(contractAddress)
      .transfer(
        toAddress,
        amount * Math.pow(10, decimals),
        (error, transaction) => {
          if (error) {
            reject(error);
          }

          resolve(transaction);
        },
      );
  });
}
  export {
      web3,
      erc20Abi,
      getERC20Balance,
      sendERC20Transaction
  }