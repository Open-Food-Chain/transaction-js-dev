
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
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});


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


async function maketx(sendTo, changeAddress, wif) {
	var utxos
        const utxo_url = base_url + address_url_ext + changeAddress + utxo_url_ext 
	const ret = await axios.get(utxo_url, { httpsAgent: agent })
  	  .then( async (res) => { 
		var  tx = "test"
		let inputValueSats = 0
    		const inputValues = []
    		let isCC = false;
    		let isChangeCC = false;
		const network = networks[name_network]	
		const txb = new TransactionBuilder(network);
		utxos = res.data

                let targets = sendTo.map(obj => {
                    const address = Object.keys(obj)[0];
                    const value = Math.round(obj[address]*100000000);
                    return { address, value };
                });

	
		utxos.forEach(fixElements)

                console.log(`targets: ${JSON.stringify(targets)}`)

		let {inputs, outputs} = coinSelect(utxos, targets, 0);

                console.log(`inputs: ${JSON.stringify(inputs)}, outputs: ${JSON.stringify(outputs)}`)

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
		var valueSats = 0
                console.log(`value sats: ${valueSats}`)

                for (let i = 0; i < sendTo.length; i++) {
                   const key = Object.keys(sendTo[i])[0];
                   console.log(key)
                   const addr = address.fromBase58Check(key);
                   const outputScript = generateOutputScript(addr.hash, addr.version, isCC)
                   const value = Math.round(sendTo[i][key]*100000000)
                   txb.addOutput(outputScript, value);
                   valueSats = valueSats + value
                }
		//const addr = address.fromBase58Check(sendTo);
    		const selfAddr = address.fromBase58Check(changeAddress);

		//let actualFeeSats = inputValueSats - valueSats 

    		//const outputScript = generateOutputScript(addr.hash, addr.version, isCC)

		//txb.addOutput(outputScript, valueSats);

                const return_amount = inputValueSats - valueSats - 1
                const return_outputScript = generateOutputScript(selfAddr.hash, selfAddr.version, isCC)

                txb.addOutput(return_outputScript, return_amount);


               let actualFeeSats = inputValueSats - return_amount - valueSats;

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

                //return new Promise(async (resolve, reject) => {
                const payload = { 'rawtx': tx };
                try {
                    var res = await axios.post(send_url, payload, { httpsAgent: agent });
                   // console.log(res)
                   // console.log("exit")
                    return res 
               //    resolve(res);
                } catch (error) {
                    console.log('Error:', error.response.data);
                    return error
                //   reject(error);
                }
               

		/*tx = { 'rawtx': tx }
                try {
    		  res = await axios.post(send_url, tx)
                  console.log("response is:")
                  return res
                } catch (error) {
                  console.log('Error:', error);
                }*/
          	  //.then( res => { console.log("txid ", res.data) })
        	 // .catch( err => { console.log('Error: ', err.message) });  
       	})
  	.catch(err => {
  //  	console.log('Error: ', err.message);
        return err
  	});

       return ret

}

module.exports = { maketx };

//maketx("RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qi")

