<h1>A decentralized application (DAPP)</h1>
<h6>
Created by Karolis Medekša for blockchain fundamentals course<br/>
Vilnius University, Faculty of Mathematics and Informatics, 2020 Fall
</h6>


<h2>About</h2>
A decentralized application, `React` was used for front-end, back-end is running on Ethereum network.
The application can be used with local test-net or `Kovan` test-net.

<h2>Setup</h2>
Launching locally:
- install truffle: `npm install -g truffle`
- install dependencies: run `npm install`
- run local test-net on Ganache, add respective config to `truffle-config.js`
- migrate contracts: `truffle migrate`
- interact using truffle console: `truffle console`
- launch tests: `truffle test`
- launch front-end: `npm start`

<h5>Beware that running `truffle migrate` will reset existing `Kovan` config</h5>

<h2>Application</h2>
The application is a simplified version of a decentralized fundraiser. It helps create 
fundraisers without any middlemen.

<h5>Possible use cases:</h5>
1. A creator creates a crowdfunding project
2. Supporters can transfer funds to the crowdfunding project
3. Supporters can refund their investment
4. Creator can complete the project and receive funds
5. Creator can cancel the project and refund all payers their funds

The smart-contract was deployed to `Kovan` test-net. Check out the details below: 
- Deployment transaction: [0x6e11418610ad5dcda060b3f9d648f53d787828db1fa3bfa2a1998472e91ae8d3](https://kovan.etherscan.io/tx/0x6e11418610ad5dcda060b3f9d648f53d787828db1fa3bfa2a1998472e91ae8d3)
- Contract: [0x7ca015e3be218cced0de78b72adf9eedd6e01203](https://kovan.etherscan.io/address/0x7ca015e3be218cced0de78b72adf9eedd6e01203)
- [Events](https://kovan.etherscan.io/address/0x7ca015e3be218cced0de78b72adf9eedd6e01203#events)

Example logs:
- [Fundraiser funds changed](https://kovan.etherscan.io/tx/0x0c5570e56a90720885d557ad216ec692f8d3d44cdeefeb5804f5f7d38db0b80b#eventlog)
- [Fundraiser created](https://kovan.etherscan.io/tx/0x416706da9dfdd089331345a5938a61776ff04e7cd41ec7fc0c674e41782571a3#eventlog)
- [Fundraiser status changed](https://kovan.etherscan.io/tx/0xc35396f7aa82f5391d13905afecda13e9dfd0ff87a1c0e176bef0b4e8801009d#eventlog)
