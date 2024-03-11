// Import required modules
//const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib');
const maketx = require('./maketx');

const axios = require('axios');

const { appConfig } = require('./appConfig');
const send_url = appConfig.explorer.send_url;
const base_url = appConfig.explorer.base_url;
const address_url_ext = appConfig.explorer.address_url_ext;
const utxo_url_ext = appConfig.explorer.utxo_url_ext;

const min_utxos = appConfig.batch.min_utxos;

// Retrieve network name from the config file
const name_network = appConfig.networks.name;


/*
TODO: remove the unique key and replace the value with the value

*/

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

function isNested(jsonObject) {
    // Check if a value is an object and not null
    const isObject = (value) => typeof value === 'object' && value !== null;

    for (let key in jsonObject) {
        if (isObject(jsonObject[key])) {
            // If the property is an array, check if any of its elements is an object
            if (Array.isArray(jsonObject[key])) {
                for (let item of jsonObject[key]) {
                    if (isObject(item)) {
                        return true; // Found a nested object within the array
                    }
                }
            } else {
                return true; // Found a nested object
            }
        }
    }
    return false; // No nested objects found
}

function get_batch_address_value( jsonObject ){
    let returnVal = null; // Placeholder for the unique key
    
    function searchUnique(obj) {
        for (let key in obj) {
            // If the unique key is found, no need to continue searching
            if (returnVal !== null) break;
            
            // Check if current property is an object and recurse
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // If the object contains the 'unique' key with a value of true, record the key
                if (obj[key].hasOwnProperty('unique') && obj[key].unique === true) {
                    returnVal = obj[key].value;
                    break; // Stop searching further since we found the unique key
                } else {
                    // Continue searching within the nested object
                    searchUnique(obj[key]);
                }
            }
        }
    }

    searchUnique(jsonObject); // Start the search
    return returnVal; // Return the found key, or null if not found
}

/**
 * Generates an address for a batch transaction.
 * 
 * @param {string} bnfp - The batch transaction string
 * @param {Object} key - The key to sign the seed
 * @returns {string} - The generated address
 */
function create_batch_address( obj, key ){

   let bnfp = get_batch_address_value(obj)

   if (typeof bnfp != typeof "test"){
    bnfp = bnfp.toString()
   }

   console.log(bnfp)

   const wallet = generate_seed_offline_wallet( bnfp, key )

   console.log(wallet)

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
      //console.log("string")
      //value = convertStringToSats( value  )
      //console.log(value)
      return value
   }
}

function val_to_obj( value, to_addy ){
    
   if (Array.isArray(value) == true ){
     let sendTo = []       
     for (let i = 0; i < value.length; i++) {
        console.log(value[i]);
        const val = value[i]/1000000000
        sendTo.push({ [to_addy]:val })
     }
     return sendTo
   }else{
     return [ { [to_addy]:value } ]
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

    const to_addy = create_batch_address( batchObj, key)
    filter = ["id", "raw_json",  "integrity_details", "created_at", "bnfp" ]
    batchObj = remove_keys_from_json_object(batchObj, filter)
    name_ecpair = remove_keys_from_json_object(name_ecpair, filter)

    var all_tx = []

    if ( !isNested(batchObj) ){

        for (const key in batchObj) {

          const from_addy = name_ecpair[key].getAddress()
          const from_wif = name_ecpair[key].keyPair.toWIF()

          const val = get_sat_value( batchObj[key] )
          
          if ( typeof val != typeof "test" ){
            const sendTo = val_to_obj( val, to_addy )
            console.log(sendTo)
            txid = await maketx.maketx(sendTo, from_addy, from_wif)
          }else{
            txid = await maketx.maketxopreturn(to_addy, from_addy, from_wif, val)
          }
          if (txid.data == undefined){
             console.log(txid)
             all_tx.push(key)
          }else{

             all_tx.push(txid.data)
          }
       }
    }else{
        const baseAddy = key.getAddress()
        const baseWIF = key.toWIF()

        const val = batchObj.toString()

        txid = await maketx.maketxopreturn(to_addy, baseAddy, baseWIF, val)

        if (txid.data == undefined){
            console.log(txid)
            all_tx.push(key)
        }else{

            all_tx.push(txid.data)
        }
    }

///   console.log(key)
      const baseAddy = key.getAddress()
      const baseWIF = key.toWIF()

 
   
  const ret = await fund_offline_wallets( name_ecpair, baseAddy, baseWIF )
  console.log(ret)

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
    //get utxos .len
    const addr = name_ecpair[element].getAddress()

    const utxos = await getUtxos(addr)
    if ( utxos.data.length < min_utxos ){
      const sendTo = [{ [addr]: 100 }];
      const txid = await maketx.maketx(sendTo, baseAddy, baseWIF);

      if (txid == undefined) {
        all_tx.push(name_ecpair[element].getAddress());
      } else {
        all_tx.push(txid.data);
      }
    }
  }

  return all_tx
}

const convertStringToSats = (str) => {
  let ret = convertAsciiStringToBytes(str) // Assuming //239 is a comment
  ret = intArrayToSatable(ret); // Assuming // is a comment
  ret = satableStringToSats(ret);
  return ret;
}

const satableStringToSats = (strVar, maxSats = 100000000) => {
  let decrese = 0;
  let nTx = 10;

  const maxSatsLen = String(maxSats).length

  // Determine order number
  while (decrese < Math.log10(nTx)) {
    decrese += 1;
    const maxSatsLen = String(maxSats).length - decrese;
    nTx = Math.ceil(strVar.length / maxSatsLen);
  }

  const ret = [];
  for (let x = 0; x < nTx; x++) {
    let strX = String(x);

    for (let n = 0; n < decrese - strX.length; n++) {
      strX = "0" + strX;
    }

    const newStr = strVar.substring(0, maxSatsLen) + strX;
    strVar = strVar.substring(maxSatsLen);

    while (strVar.length < String(maxSats).length) {
      strVar = "0" + strVar;
    }

    ret.push(newStr);
  }

  return ret;
}

const intArrayToSatable = (arrInt) => {
  let finalInt = 0;
  let buildStr = "";
  const maxLenVal = 3;

  for (const val of arrInt) {
    let strVal = String(val);

    if (strVal.length < maxLenVal) {
      for (let x = 0; x < maxLenVal - strVal.length; x++) {
        strVal = "0" + strVal;
      }
    }

    buildStr = buildStr + strVal;
  }

  return buildStr;
}

const convertAsciiStringToBytes = (str) => {
  const byteValue = Buffer.from(str, 'utf-8');
  const totalInt = [];
  for (const byte of byteValue) {
    totalInt.push(byte);
  }
  return totalInt;
}

const convArrToJSON = ( arr, toAddr ) => {
  let jsonArr = []

  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    jsonArr.push({ [toAddr]:arr[i] })
  }

  return jsonArr
}

const getUtxos = async ( addr ) => {
  const utxo_url = base_url + address_url_ext + addr + utxo_url_ext 
  const ret = await axios.get(utxo_url)
  return ret

}


module.exports = { fund_offline_wallets, send_batch_transactions, get_all_ecpairs };
