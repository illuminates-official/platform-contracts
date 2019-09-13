const CONTRACTS_DIR = "./contracts/completed";

module.exports = {

  contracts_directory: CONTRACTS_DIR,

  networks: {
 
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
  },

  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      showTimeSpent: true,
      excludeContracts: ['Migrations'],
      src: CONTRACTS_DIR,
      onlyCalledMethods: true
     }
  },

  compilers: {
    solc: {
      version: "0.5.11",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,       // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {         // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
       evmVersion: "petersburg"
      }
    }
  }
};
