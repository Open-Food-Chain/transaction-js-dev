

const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')

const maketx = require('./maketx')

//maketx.maketx("RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio", 2000)


//const name_network = bitGoUTXO.networks.name
const name_network = config.get('networks.name')

res = bitGoUTXO.ECPair.fromWIF("UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio", bitGoUTXO.networks[name_network])
addy = res.getAddress()

console.log(addy)

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
        str = generate_string(wallet[key]);
        seed =  generate_seed_offline_wallet( str, keypair );
        name_and_seed[key] = seed;
    }

    return name_and_seed
}



final = get_all_wallets( wallet, res);

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
