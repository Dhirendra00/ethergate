
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/kJrSNktYfgRPko-O2SoAkwtx0SQjqKEC',
      accounts: ['8b245dbd89b306136320cbff1e4fa1a1656ef6ea6ad71ffae85c810b68b1105f'],
    },
  },
};
