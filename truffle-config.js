const path = require("path");
const HDWalletProvider = require('./client/node_modules/@truffle/hdwallet-provider');
require('./client/node_modules/dotenv').config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${RINKEBY_KEY}`),
      network_id: 4,       // Rinkeby's id
      gas: 5500000,        // Rinkeby has a lower block limit than mainnet
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )      
    }
  },
  compilers: {
    solc: {
      version: "0.8.9"
    }
  }
};
