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
    const wallet = EthereumJsWallet.fromPrivateKey(Buffer.from('3b6aef7a6aa2ceda0852fc83559d5390579bc1b4b63a2203ab2793efdb9da3dd', 'hex'));
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
    const walletAddress = '0x700E1C53B779d2aFD316Da5231d17Cb8464A899D'

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