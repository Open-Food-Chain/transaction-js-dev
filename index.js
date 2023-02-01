const txlib = require('agama-wallet-lib');

const sendTo = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const changeAddress = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"
const networks = txlib.btcnetworks
var network = networks.btc
//version is not good in the lib atm, manual override to get rid of warining
network.wif = 188

var utxo;
const changeValue = 1
const spendValue = 1
var options;

console.log(network)

console.log(txlib.transactionBuilder.transaction(sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options));

// the hello world program
console.log('Hello World');
