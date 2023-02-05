const txlib = require('agama-wallet-lib');
const http = require('node:http');
const axios = require('axios');

const sendTo = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const changeAddress = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"
const networks = txlib.btcnetworks
var network = networks.kmd
//version is not good in the lib atm, manual override to get rid of warining
//network.wif = 188

/*const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options1 = {
  hostname: 'blockchain-explorer.staging.juicychain.org',
  port: 443,
  path: '/insight-api-komodo/addrs/RWw3NDp2CJumPCRj9fm6HovJNeFJi9eLyy/utxo',
  method: 'GET',
};

const req = http.get(options1, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(res)
});
req.end()
*/

axios.get('http://blockchain-explorer.staging.juicychain.org/insight-api-komodo/addrs/RWw3NDp2CJumPCRj9fm6HovJNeFJi9eLyy/utxo')
  .then(res => { console.log(res.data) })
  .catch(err => {
    console.log('Error: ', err.message);
  });


var utxo = [{
    "address": "RVaH1r1i2dos15SzD6MBVp8KNEcKTnrn7u",
    "txid": "93507012d0486e7cb43a8d21db796b23286ea2f540e476bdedbce83badf565e1",
    "vout": 0,
    "scriptPubKey": "76a914de9db53f0375739381da280c80095d05287bebf688ac",
    "amount": 0.0001,
    "satoshis": 10000,
    "value": 10000,
    "height": 274652,
    "confirmations": 18
    }]


//value and amount sats = same

const changeValue = 1
const spendValue = 1
var options;

console.log(network)

console.log(txlib.transactionBuilder.transaction(sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options));

// the hello world program
console.log('Hello World');
