

const config = require('config');
const txlib = require('agama-wallet-lib');
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
const { appConfig } = require('./appConfig');

//vars
//const sendTo = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
//const changeAddress = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
//const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

const IADDRESS_VERSION = 102 

const send_url = appConfig.explorer.send_url;
const base_url = appConfig.explorer.base_url;
const address_url_ext = appConfig.explorer.address_url_ext;
const utxo_url_ext = appConfig.explorer.utxo_url_ext;
const name_network = appConfig.networks.name;


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

function getOpReturnScript(data) {
    // Convert string data to a buffer
    const dataBuffer = Buffer.from(data, 'utf8');

    const OP_RETURN = Buffer.from("6a", 'hex');
    const OP_PUSHDATA2 = Buffer.from("4d", 'hex');
    let hexLength = dataBuffer.length;
    let lengthBuffer;

    if (hexLength > 0xFF) { // If length requires more than 2 hex characters (255 in decimal)
        lengthBuffer = Buffer.alloc(2); // Allocate 2 bytes for length
        lengthBuffer.writeUInt16LE(hexLength); // Write length in Little Endian format
    } else {
        lengthBuffer = Buffer.alloc(1); // Allocate 1 byte for length
        lengthBuffer.writeUInt8(hexLength); // Write length
    }

    // Concatenate OP_RETURN, (optional) OP_PUSHDATA2, lengthBuffer, and dataBuffer into a single buffer
    if (hexLength > 0xFF) {
        return Buffer.concat([OP_RETURN, OP_PUSHDATA2, lengthBuffer, dataBuffer]);
    } else {
        return Buffer.concat([OP_RETURN, lengthBuffer, dataBuffer]);
    }
}



const fixElements = (utxo) => {
  utxo['value'] = utxo['satoshis']
}


async function maketx(sendTo, changeAddress, wif) {
    var utxos;
    const utxo_url = base_url + address_url_ext + changeAddress + utxo_url_ext;
    const ret = await axios.get(utxo_url)
        .then(async (res) => {
            var tx = "test";
            let inputValueSats = 0;
            const inputValues = [];
            let isCC = false;
            let isChangeCC = false;
            const network = networks[name_network];
            const txb = new TransactionBuilder(network);
            utxos = res.data;

            let targets = sendTo.map(obj => {
                const address = Object.keys(obj)[0];
                const value = Math.round(obj[address] * 100000000);
                return { address, value };
            });

            utxos.forEach(fixElements);
            console.log(`targets: ${JSON.stringify(targets)}`);

            let { inputs, outputs } = coinSelect(utxos, targets, 0);
            console.log(`inputs: ${JSON.stringify(inputs)}, outputs: ${JSON.stringify(outputs)}`);

            if (!outputs) {
                throw new Error(
                    'Insufficient funds. Failed to calculate acceptable transaction amount with fee of ' +
                    "0.1" +
                    '.',
                );
            }

            txb.setVersion(4);
            txb.setExpiryHeight(Number("605000"));
            txb.setVersionGroupId(0x892f2085);

            for (const input of inputs) {
                const { txid, vout, scriptPubKey, value } = input;
                const inputValueBigNum = value;

                inputValues.push(inputValueBigNum);
                inputValueSats += inputValueBigNum;

                txb.addInput(
                    txid,
                    vout,
                    Transaction.DEFAULT_SEQUENCE,
                    Buffer.from(scriptPubKey, 'hex'),
                );
            }

            var valueSats = 0;
            for (let i = 0; i < sendTo.length; i++) {
                const key = Object.keys(sendTo[i])[0];
                console.log(key);
                const addr = address.fromBase58Check(key);
                const outputScript = generateOutputScript(addr.hash, addr.version, isCC);
                const value = Math.round(sendTo[i][key] * 100000000);
                txb.addOutput(outputScript, value);
                valueSats += value;
            }

            const selfAddr = address.fromBase58Check(changeAddress);
            const return_amount = inputValueSats - valueSats - 1;
            const return_outputScript = generateOutputScript(selfAddr.hash, selfAddr.version, isCC);
            txb.addOutput(return_outputScript, return_amount);

            let keyPair = ECPair.fromWIF(wif, network);

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
            tx = tx.toHex();
            const payload = { 'rawtx': tx };
            try {
                var res = await axios.post(send_url, payload);
                return res;
            } catch (error) {
                console.log('Error:', error.response.data);
                return error;
            }
        })
        .catch(err => {
            return err;
        });

    return ret;
}

async function maketxopreturn(sendTo, changeAddress, wif, data) {
    var utxos;
    const utxo_url = base_url + address_url_ext + changeAddress + utxo_url_ext;
    const ret = await axios.get(utxo_url)
        .then(async (res) => {
            const inputValues = [];
            let inputValueSats = 0;
            const network = networks[name_network];
            const txb = new TransactionBuilder(network);
            utxos = res.data;

            // Hardcoded amount to send to the 'sendTo' address
            const sendAmount = 2048;

            utxos.forEach(utxo => {
                utxo.value = utxo.satoshis; // Ensure value property is present
            });

            const targets = [
                { address: sendTo, value: sendAmount },
                // No need to specify the change and OP_RETURN here as targets for coinSelect
            ];

            let { inputs, outputs } = coinSelect(utxos, targets, 1000); // Fee is not considered here, adjust accordingly

            for (const input of inputs) {
                const { txid, vout, scriptPubKey, value } = input;
                const inputValueBigNum = value;

                inputValues.push(inputValueBigNum);
                inputValueSats += inputValueBigNum;

                txb.addInput(
                    txid,
                    vout,
                    Transaction.DEFAULT_SEQUENCE,
                    Buffer.from(scriptPubKey, 'hex'),
                );
            }

            if (!outputs) {
                throw new Error('Insufficient funds.');
            }

            txb.setVersion(4);
            txb.setExpiryHeight(Number("605000"));
            txb.setVersionGroupId(0x892f2085);

            // Add output to 'sendTo' address
            txb.addOutput(sendTo, sendAmount);

            // Calculate the amount left for the changeAddress
            let totalOutputValue = sendAmount; // Initialize with the sendTo amount

            //totalOutputValue += 0; // OP_RETURN outputs have a value of 0

            // Add change output
            const changeAmount = inputValueSats - totalOutputValue - 1000; // Subtract estimated transaction fee
            if (changeAmount > 0) {
                txb.addOutput(changeAddress, changeAmount);
            }

            // Create OP_RETURN output
            const opReturnOutput = getOpReturnScript(data);

            console.log(opReturnOutput)

            txb.addOutput(opReturnOutput, 0);

            // Sign each input
            let keyPair = ECPair.fromWIF(wif, network);
            for (let i = 0; i < inputs.length; i++) {
                txb.sign(i, keyPair, null, Transaction.SIGHASH_ALL, inputValues[i]);
            }

            // Build and serialize the transaction
            const tx = txb.build().toHex();

            // Broadcast the transaction
            const payload = { rawtx: tx };
            try {
                const res = await axios.post(send_url, payload);
                return res;
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
                return error;
            }
        })
        .catch(err => {
            console.error('Error:', err.message);
            return err;
        });

    return ret;
}


module.exports = { maketx, maketxopreturn };

//maketx("RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qi")

