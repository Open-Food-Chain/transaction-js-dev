

const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')

const maketx = require('./maketx')

//maketx.maketx("RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio", 2000)


//const name_network = bitGoUTXO.networks.name
const name_network = config.get('networks.name')

res = bitGoUTXO.ECPair.fromWIF("UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio", bitGoUTXO.networks[name_network])
addy = res.getAddress()

console.log(addy)

const test_batch = {
        "id": "b6c23100-bb41-4477-b0a5-f72e8504c9fb",
        "anfp": "11000011",
        "dfp": "Description here",
        "bnfp": "637893",
        "pds": "2020-03-01",
        "pde": "2020-03-05",
        "jds": 2,
        "jde": 7,
        "bbd": "2020-05-05",
        "pc": "DE",
        "pl": "Herrath",
        "rmn": "11200100520",
        "pon": "123072",
        "pop": "164",
        "mass": 1.0,
        "raw_json": "eyBcImFuZnBcIjogXCIxMTAwMDAxMVwiLFwiZGZwXCI6IFwiRGVzY3JpcHRpb24gaGVyZVwiLFwiYm5mcFwiOiBcIjYzNzg5M1wiLFwicGRzXCI6IFwiMjAyMC0wMy0xXCIsXCJwZGVcIjogXCIyMDIwLTAzLTVcIixcImpkc1wiOiAyLFwiamRlXCI6IDcsXCJiYmRcIjogXCIyMDIwLTA1LTVcIixcInBjXCI6IFwiREVcIixcInBsXCI6IFwiSGVycmF0aFwiLFwicm1uXCI6IFwiMTEyMDAxMDA1MjBcIixcInBvblwiOiBcIjEyMzA3MlwiLFwicG9wXCI6IFwiMTY0XCIK",
        "integrity_details": null,
        "created_at": "2023-09-25T08:21:45.070925Z",
        "percentage": null
    }

const wallet = {
  WALLET_DELIVERY_DATE: "DELIVERY_DATE",
  WALLET_JULIAN_START: "JULIAN_START",
  WALLET_JULIAN_STOP: "JULIAN_STOP",
  WALLET_BB_DATE: "BB_DATE",
  WALLET_PROD_DATE: "PROD_DATE",
  WALLET_ORIGIN_COUNTRY: "ORIGIN_COUNTRY",
  WALLET_TIN: "TIN",
  WALLET_PON: "PON",
  WALLET_PRODUCTID: "PRODUCTID",
  WALLET_MASS_BALANCE: "MASS_BALANCE"
};

const test_bnfp = "187556"


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


function get_all_ecpairs( wallet ){
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

async function send_batch_transactions( name_ecpair, batchObj, key){
   const to_addy = create_batch_address( batchObj['bnfp'], key)
   filter = ["id", "raw_json",  "integrity_details", "created_at", "bnfp" ]
   batchObj = remove_keys_from_json_object(batchObj, filter)
   name_ecpair = remove_keys_from_json_object(name_ecpair, filter)
   console.log(to_addy)

  all_tx = []

   for (const key in batchObj) {
      //console.log(`The value of ${key} is ${test_batch[key]}`);
      const from_addy = name_ecpair[key].getAddress()
      const from_wif = name_ecpair[key].keyPair.toWIF()
      console.log(`the address ${from_addy}, the wif ${from_wif}`)
      txid = await maketx.maketx(to_addy, from_addy, from_wif, 2000)
      //console.log(`The value of ${key} is ${test_batch[key]}, tx is ${txid}`)
      all_tx.push(txid.data)
   }

  return all_tx
}


async function fund_offline_wallets( name_ecpair, baseAddy, baseWIF ){
  all_tx = []

  for (const element in name_ecpair) {
    
    txid = await maketx.maketx(name_ecpair[element].getAddress(), baseAddy, baseWIF, 2000)
   
    all_tx.push(txid.data);
  }

  return all_tx
}

/*final = get_all_wallets( wallet, res);

console.log(final)

final = get_all_ecpairs( final )

console.log(final)

baseAddy = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
baseWIF = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};


(async () => {
  for (const element in final) {
    console.log(element)
    txid = await maketx.maketx(final[element].getAddress(), baseAddy, baseWIF, 2000)
    //txid = await txid
    console.log("txid")
    console.log(txid.data);
    console.log("txid")
  }
})();

*/

//baseAddy = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
//baseWIF = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"


//const wal = get_all_wallets( test_bnfp, res)
//console.log(wal)

const ret = get_all_wallets( test_batch, res )
//filter = ["id", "raw_json",  "integrity_details", "created_at", "bnfp" ]
//const final = remove_keys_from_json_object(ret, filter)
ec_pairs = get_all_ecpairs( ret )

console.log(ec_pairs);

baseAddy = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
baseWIF = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio";

( async () => { 
  const tx = await fund_offline_wallets( ec_pairs, baseAddy, baseWIF ) 
  console.log(tx)
})();


( async () => { 
  const tx = await send_batch_transactions( ec_pairs, test_batch, res )
  console.log(tx)
})();
