// Import required modules
const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib');
const maketx = require('./maketx');

// Retrieve network name from the config file
const name_network = config.get('networks.name');

/**
 * Generates a string from the given name.
 * The string consists of the JSON representation of an object containing the name, 
 * followed by the name itself.
 *
 * @param {string} name - The name to be converted to a string
 * @returns {string} - The generated string
 */
function generate_string(name){

    obj = {
        "name": name
    }

    start = JSON.stringify(obj, null, 2);
    end = name
    full = start + end
    return full
}

/**
 * Encodes a Buffer into a Base58 string.
 *
 * @param {Buffer} buffer - The buffer to encode
 * @returns {string} - The Base58 encoded string
 */
function encodeBase58(buffer) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let carry, digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    carry = buffer[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  // remove leading zeros
  let zero = 0;
  while (buffer[zero] === 0 && zero < buffer.length - 1) {
    zero++;
  }
  return ALPHABET[digits.pop()] + ALPHABET[0].repeat(zero) + digits.reverse().map(d => ALPHABET[d]).join('');
}

/**
 * Generates a seed for an offline wallet.
 * 
 * @param {string} str - The initial string to use for generating the seed
 * @param {Object} key - The key for signing to generate the seed
 * @returns {Buffer} - The generated seed
 */
function generate_seed_offline_wallet( str, key ){
    var myBuffer = Buffer.from(str, 'utf-8');

    if (myBuffer.length > 32) {
         myBuffer = myBuffer.slice(0, 32);
    }

    if (myBuffer.length < 32) {
       let newBuffer = Buffer.alloc(32);
       myBuffer.copy(newBuffer);
       myBuffer = newBuffer;
    }

    sign = key.sign(myBuffer)

    sign = sign.toCompact()
    sign = sign.slice(0,64)

    return sign
}

/**
 * Generates key pairs for all wallets in the provided object.
 * 
 * @param {Object} wallet - The wallet object containing names
 * @param {Object} keypair - The key pair to use for generating seeds
 * @returns {Object} - An object mapping wallet names to their corresponding key pairs
 */
function get_all_ecpairs( wallet, keypair ){
    wallet = get_all_wallets( wallet, keypair)

    var name_and_pair = {};

    for (const key in wallet) {
        pair = bitGoUTXO.HDNode.fromSeedBuffer(wallet[key], bitGoUTXO.networks[name_network]);
        name_and_pair[key] = pair;
    }

    return name_and_pair
}

/**
 * Generates seeds for all the wallets in the provided object.
 * 
 * @param {Object} wallet - The wallet object containing names
 * @param {Object} keypair - The key pair to use for generating seeds
 * @returns {Object} - An object mapping wallet names to their corresponding seeds
 */
function get_all_wallets( wallet, keypair){
    var name_and_seed = {};

    for (const key in wallet) {
        str = generate_string( key);
        seed =  generate_seed_offline_wallet( str, keypair );
        name_and_seed[key] = seed;
    }

    return name_and_seed
}

/**
 * Generates an address for a batch transaction.
 * 
 * @param {string} bnfp - The batch transaction string
 * @param {Object} key - The key to sign the seed
 * @returns {string} - The generated address
 */
function create_batch_address( bnfp, key ){
   const wallet = generate_seed_offline_wallet( bnfp, key )
   const pair = bitGoUTXO.HDNode.fromSeedBuffer(wallet, bitGoUTXO.networks[name_network]);
   const addy = pair.getAddress()
   return addy
}


/**
 * Removes specified keys from a JSON object.
 * 
 * @param {Object} jsonObject - The original JSON object
 * @param {Array} keysToRemove - Array of keys to remove
 * @returns {Object} - New object with specified keys removed
 */
function remove_keys_from_json_object(jsonObject, keysToRemove) {
  const newObj = { ...jsonObject }; // Create a shallow copy of the original object
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

/**
 * Categorizes the input variable as an integer, date, or string.
 * 
 * @param {*} varInput - The variable to categorize
 * @returns {number} - 0 for integer, 1 for date, 2 for string
 */
function categorizeVariable(varInput) {
  // Check if it's an integer
  if (Number.isInteger(varInput)) {
    return 0;
  }

  // Check if it's a string representing an integer
  if (typeof varInput === 'string' && !isNaN(varInput) && Number.isInteger(Number(varInput))) {
    return 0;
  }
  
  // Check if it's a date in yyyy-mm-dd format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof varInput === 'string' && dateRegex.test(varInput)) {
    const dateParts = varInput.split('-');
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    if (date && !isNaN(date.getTime())) {
      return 1;
    }
  }

  // Otherwise, it's a string
  return 2;
}


/**
 * Converts a value to its Satoshi equivalent.
 * 
 * @param {*} value - The value to convert
 * @returns {string} - The value in Satoshi units
 */
function get_sat_value( value ){
   if (value == null){
      return "0"
   }
   const cat = categorizeVariable( value )
   if (cat == 0){
      const length = value.toString().length;
      if (length < 4){
         value = value*1000
      }
      value = value / 100000000;
      return value
   }else if (cat == 1){

      value = value.replace(/-/g, '');  // Replace dashes with empty string
      value = Number(value);  // Convert to number
      value = value / 100000000;
      //value = String(value)
      return value
   }else if (cat == 2){
      console.log("string")
      console.log(value)
   }
}

/**
 * Sends batch transactions to multiple addresses.
 * 
 * @param {Object} name_ecpair - Object mapping names to key pairs
 * @param {Object} batchObj - Object containing batch transaction details
 * @param {Object} key - The key to use for signing
 * @returns {Array} - An array containing transaction IDs or error information
 */
async function send_batch_transactions( name_ecpair, batchObj, key){
   const to_addy = create_batch_address( batchObj['bnfp'], key)
   filter = ["id", "raw_json",  "integrity_details", "created_at", "bnfp" ]
   batchObj = remove_keys_from_json_object(batchObj, filter)
   name_ecpair = remove_keys_from_json_object(name_ecpair, filter)

   var all_tx = []

   for (const key in batchObj) {

      const from_addy = name_ecpair[key].getAddress()
      const from_wif = name_ecpair[key].keyPair.toWIF()

      const val = get_sat_value( batchObj[key] )
      const sendTo = [ { [to_addy]:val } ]
      console.log(sendTo)
      txid = await maketx.maketx(sendTo, from_addy, from_wif)
      if (txid.data == undefined){
        
         all_tx.push(key)
      }else{

         all_tx.push(txid.data)
      }
   }

  return all_tx
}

/**
 * Funds offline wallets with a small amount of cryptocurrency.
 * 
 * @param {Object} name_ecpair - Object mapping names to key pairs
 * @param {string} baseAddy - The source address for funding
 * @param {string} baseWIF - The Wallet Import Format string for the source address
 * @returns {Array} - An array containing transaction IDs or error information
 */
async function fund_offline_wallets( name_ecpair, baseAddy, baseWIF ){
  var all_tx = []

  for (const element in name_ecpair) {
    const addr = name_ecpair[element].getAddress()
    const sendTo = [ { [addr]:100 } ]
    console.log(sendTo)
    txid = await maketx.maketx(sendTo, baseAddy, baseWIF)
    if (txid == undefined) {
        all_tx.push(name_ecpair[element].getAddress())
    }else{   
        all_tx.push(txid.data);
    }
  }

  return all_tx
}


module.exports = { fund_offline_wallets, send_batch_transactions, get_all_ecpairs };
