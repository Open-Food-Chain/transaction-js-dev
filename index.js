
const txlib = require('agama-wallet-lib');
const http = require('node:http');
const axios = require('axios');
const {
  script,
  opcodes,
  OptCCParams,
  TransactionBuilder,
  networks,
  Transaction,
  address,
  ECPair,
  TxDestination,
} = require('@bitgo/utxo-lib');
const BigNumber = require('@ethersproject/bignumber');
const coinSelect = require('coinselect')

const sendTo = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const changeAddress = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"
const IADDRESS_VERSION = 102

//const networks = txlib.btcnetworks

//costum network
var network ={
    messagePrefix: '\x19Komodo Signed Message:\n',
    bip44: 141,
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x55,
    wif: 0xbc,
    consensusBranchId: {
      1: 0x00,
      2: 0x00,
      3: 0x5ba81b19,
      4: 0x76b809bb,
    },
    coin: 'kmd', 
    isZcash: true,
    sapling: true,
    saplingActivationTimestamp: 61,
    isZcashCompatible: true
  }


//console.log(network.isZcash)
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

const generateOutputScript = (destHash, destVersion, isCC) => {
  if (isCC) {
    const outMaster = new OptCCParams(3, 0, 0, 0);
    const outParams = new OptCCParams(3, 0, 1, 1, [
      new TxDestination(
        destVersion === IADDRESS_VERSION
          ? new TxDestination().typeID
          : new TxDestination().typePKH,
        destHash,
      ),
    ]);

    return script.compile([
      outMaster.toChunk(),
      opcodes.OP_CHECKCRYPTOCONDITION,
      outParams.toChunk(),
      opcodes.OP_DROP,
    ]);
  } else {
    return address.toBase58Check(destHash, destVersion);
  }
};

var utxos

axios.get('https://blockchain-explorer.staging.juicychain.org/insight-api-komodo/addrs/RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN/utxo')
  .then(res => { 
	var  tx = "test"
	console.log(networks)
	let inputValueSats = 0
    	const inputValues = []
    	let isCC = false;
    	let isChangeCC = false;
	network = networks['kmd']

	const txb = new TransactionBuilder(networks['kmd']);
	utxos = res.data

	console.log(txb)

	//console.log(utxos)
	
	let targets = [
      		{
        	address: sendTo,
        	value: utxos[0]['satoshis']-1 , //utxos[0]['satoshis'],
     		},
    	];

	//console.log(utxos)

	utxos = [utxos[2]]
	utxos[0]['value'] = utxos[0]['satoshis']
	
	//console.log(utxos)	

	//console.log(targets)

	let {inputs, outputs} = coinSelect(utxos, targets, 0);

	console.log("INPUTS: ")
	console.log(inputs)

	if (!outputs) {
      		throw new Error(
        		'Insufficient funds. Failed to calculate acceptable transaction amount with fee of ' +
          		"0.1" +
          		'.',
      			);
    	}

    	txb.setVersion(4);
	console.log("isoverwintedcompat: " + txb.isOverwinterCompatible)
    	txb.setExpiryHeight(
      	Number(
	"605000"
        //longestchain
        //BigNumber.BigNumber(100000).plus(BigNumber(100)).toString(),
      		),
    	);
    	txb.setVersionGroupId(0x892f2085);
	for (const input of inputs) {
      		const {txid, vout, scriptPubKey, value} = input;
		console.log(input)
      		const inputValueBigNum = value

      		inputValues.push(inputValueBigNum)
      		inputValueSats = inputValueSats + inputValueBigNum

      		txb.addInput(
        		txid,
        		vout,
        		Transaction.DEFAULT_SEQUENCE,
        		Buffer.from(scriptPubKey, 'hex'),
      		);
    	}
	const valueSats = inputValueSats - 1
	const addr = address.fromBase58Check(sendTo);
    	const selfAddr = address.fromBase58Check(sendTo);

	let actualFeeSats = inputValueSats - valueSats 

    	const outputScript = generateOutputScript(addr.hash, addr.version, isCC)

	txb.addOutput(outputScript, valueSats);

	let keyPair = ECPair.fromWIF(wif, network)

	for (let i = 0; i < txb.inputs.length; i++) {
      		txb.sign(
        		i,
        		keyPair,
        		null,
        		Transaction.SIGHASH_ALL,
        		inputValues[i],
      		);
    	}
	//console.log("with sig")
        console.log("with sig: " + JSON.stringify(txb))
	var tx = txb.build();
	console.log(tx)
	tx = tx.toHex()

	console.log("tx: " + tx)
	/*console.log(res.data[0])
	utxo = [res.data[0]]
	utxo[0]['value'] = utxo[0]['satoshis']
	const spendValue = 1
	const changeValue = (utxo[0]['value'] - spendValue) - 1
	var options = "";

	//console.log(network)

	console.log('sendTo: ', sendTo, 'changeAddress: ', changeAddress, 'wif: ', wif, 'network', network, 'utxo', utxo, 'changeValue', changeValue, 'spendValue', spendValue,'options', options ) 
	var tx = txlib.transactionBuilder.transaction(sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options);
	
	console.log("tx: ", tx)
	const debug = true;
	//console.log(txlib.transactionDecoder)
	var decodetx = txlib.decoder(tx, network, debug)
	console.log(decodetx) 
        */
	//correct format for api
	tx = { 'rawtx': tx }

	axios.post('https://blockchain-explorer.staging.juicychain.org/insight-api-komodo/tx/send', tx)
          .then( res => { console.log("test: ", res.data) })
          .catch(err => { console.log('Error: ', err.message) });  
       })
  .catch(err => {
    console.log('Error: ', err.message);
  });


//select utxo's

/*var utxo = [{
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
*/


//value and amount sats = same

/*const changeValue = 1
const spendValue = 1
var options;

console.log(network)

console.log(txlib.transactionBuilder.transaction(sendTo, changeAddress, wif, network, utxo, changeValue, spendValue, options));

// the hello world program
console.log('Hello World');
*/
