const config = require('config');
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

//vars
//const sendTo = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
//const changeAddress = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
//const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

const IADDRESS_VERSION = 102 
const send_url = config.get('explorer.send_url')
const base_url = config.get('explorer.base_url')
const address_url_ext = config.get('explorer.address_url_ext')
const utxo_url_ext = config.get('explorer.utxo_url_ext')
const name_network = config.get('networks.name')

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

const fixElements = (utxo) => {
	utxo['value'] = utxo['satoshis']
}


function maketx(sendTo, changeAddress, wif, amount) {
	var utxos
        const utxo_url = base_url + address_url_ext + changeAddress + utxo_url_ext 
	axios.get(utxo_url)
  	  .then(res => { 
		var  tx = "test"
		let inputValueSats = 0
    		const inputValues = []
    		let isCC = false;
    		let isChangeCC = false;
		const network = networks[name_network]
	
		const txb = new TransactionBuilder(network);
		utxos = res.data
	
		let targets = [
      			{
        		address: sendTo,
        		value: amount ,
     			},
    		];

	
		utxos.forEach(fixElements)

		let {inputs, outputs} = coinSelect(utxos, targets, 0);

		if (!outputs) {
      			throw new Error(
        			'Insufficient funds. Failed to calculate acceptable transaction amount with fee of ' +
          			"0.1" +
          			'.',
      				);
    		}

    		txb.setVersion(4)
    		txb.setExpiryHeight(
      		Number(
			"605000"
      			),
    		);

	    	txb.setVersionGroupId(0x892f2085);
		for (const input of inputs) {
      			const {txid, vout, scriptPubKey, value} = input;
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
		var tx = txb.build();
	
		tx = tx.toHex()

		tx = { 'rawtx': tx }

		axios.post(send_url, tx)
          	  .then( res => { console.log("txid ", res.data) })
        	  .catch(err => { console.log('Error: ', err.message) });  
       	})
  	.catch(err => {
    	console.log('Error: ', err.message);
  	});

}

module.exports = { maketx };

//maketx("RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qi")
