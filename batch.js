const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')

const maketx = require('./maketx')

const name_network = config.get('networks.name')

function generate_string(name){

    obj = {
        "name": name
    }

    start = JSON.stringify(obj, null, 2);
    end = name
    full = start + end
    return full
}

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


function get_all_ecpairs( wallet, keypair ){
    wallet = get_all_wallets( wallet, keypair)

    var name_and_pair = {};

    for (const key in wallet) {
        //str = generate_string(wallet[key]);
        console.log(key)
        console.log(wallet[key])
        pair = bitGoUTXO.HDNode.fromSeedBuffer(wallet[key], bitGoUTXO.networks[name_network]);
        //seed =  generate_seed_offline_wallet( str, res );
        name_and_pair[key] = pair;
    }

    return name_and_pair
}

function get_all_wallets( wallet, keypair){
    var name_and_seed = {};

    for (const key in wallet) {
        str = generate_string( key);
        seed =  generate_seed_offline_wallet( str, keypair );
        name_and_seed[key] = seed;
    }

    return name_and_seed
}

function create_batch_address( bnfp, key ){
   const wallet = generate_seed_offline_wallet( bnfp, key )
   const pair = bitGoUTXO.HDNode.fromSeedBuffer(wallet, bitGoUTXO.networks[name_network]);
   const addy = pair.getAddress()
   return addy
}

function remove_keys_from_json_object(jsonObject, keysToRemove) {
  const newObj = { ...jsonObject }; // Create a shallow copy of the original object
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

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

function get_sat_value( value ){
   if (value == null){
      return "0"
   }
   const cat = categorizeVariable( value )
   //console.log(cat)
   if (cat == 0){
//      console.log("int")
      const length = value.toString().length;
      console.log(`value: ${value}, length: ${length}`)
      if (length < 4){
         value = value*1000
      }
      console.log(`new val: ${value}`)
      value = value / 100000000;
      return value
   }else if (cat == 1){
//      console.log("date")
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

async function send_batch_transactions( name_ecpair, batchObj, key){
   const to_addy = create_batch_address( batchObj['bnfp'], key)
   filter = ["id", "raw_json",  "integrity_details", "created_at", "bnfp" ]
   batchObj = remove_keys_from_json_object(batchObj, filter)
   name_ecpair = remove_keys_from_json_object(name_ecpair, filter)
   console.log(to_addy)

   var all_tx = []

   for (const key in batchObj) {
      //console.log(`The value of ${key} is ${test_batch[key]}`);
      const from_addy = name_ecpair[key].getAddress()
      const from_wif = name_ecpair[key].keyPair.toWIF()
//      console.log(`the address ${from_addy}, the wif ${from_wif}`)
      const val = get_sat_value( batchObj[key] )
      txid = await maketx.maketx(to_addy, from_addy, from_wif, val)
      if (txid.data == undefined){
      //   console.log(`addy: ${from_addy}, key: ${key}, amount: ${val}`)
         all_tx.push(key)
      }else{
      //console.log(`The value of ${key} is ${test_batch[key]}, tx is ${txid}`)
         all_tx.push(txid.data)
      }
   }

  return all_tx
}


async function fund_offline_wallets( name_ecpair, baseAddy, baseWIF ){
  var all_tx = []

  for (const element in name_ecpair) {
    
    txid = await maketx.maketx(name_ecpair[element].getAddress(), baseAddy, baseWIF, 100)
    if (txid == undefined) {
        all_tx.push(name_ecpair[element].getAddress())
    }else{   
        all_tx.push(txid.data);
    }
  }

  return all_tx
}

console.log("hello world")


module.exports = { fund_offline_wallets, send_batch_transactions, get_all_ecpairs };
