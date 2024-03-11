
const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')
const { appConfig } = require('./appConfig');



const { fund_offline_wallets, send_batch_transactions, get_all_ecpairs } = require('./batch.js')

const { maketx, maketxopreturn } = require('./maketx')

const name_network = appConfig.networks.name;

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
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomDate() {
  const start = new Date(2000, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function createRandomJSON() {
  return {
    "id": generateRandomString(36),
    "anfp": String(Math.floor(Math.random() * 100000000)),
    "dfp": generateRandomString(16),
    "bnfp": String(Math.floor(Math.random() * 1000000)),
    "pds": generateRandomDate(),
    "pde": generateRandomDate(),
    "jds": String(Math.floor(Math.random() * 10)),
    "jde": String(Math.floor(Math.random() * 10)),
    "bbd": generateRandomDate(),
    "pc": generateRandomString(2),
    "pl": generateRandomString(8),
    "rmn": String(Math.floor(Math.random() * 10000000000)),
    "pon": String(Math.floor(Math.random() * 1000000)),
    "pop": String(Math.floor(Math.random() * 1000)),
    "mass": String(Math.random().toFixed(2)),
    "raw_json": Buffer.from(JSON.stringify({ randomKey: generateRandomString(5) })).toString('base64'),
    "integrity_details": Math.random() > 0.5 ? null : generateRandomString(10),
    "created_at": new Date().toISOString(),
    "percentage": Math.random() > 0.5 ? null : String(Math.floor(Math.random() * 100))
  };
}

async function sample_batch( wif ){
  //const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks[name_network])
  
  const test_batch = createRandomJSON() 

  console.log(`test batch: ${JSON.stringify(test_batch)}`)

  const ec_pairs = get_all_ecpairs( test_batch, res )

  const tx1 = await send_batch_transactions( ec_pairs, test_batch, res ) 
  console.log(`batchtx: ${JSON.stringify(tx1)}`)

  return tx1
}

async function opreturn( wif ){
  const sendTo = "RGKg9LCmU5i9JL2PceLbhM9HenHmMzDU7i"
  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks[name_network])
  const data = "Hallo this is chris"
  const changeAddress = res.getAddress();

  
  const ret = await maketxopreturn(sendTo, changeAddress, wif, data);

  console.log(ret)

  return ret
}

const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

//const test = sample_batch(wif);

//console.log(test)


opreturn(wif)



//const ret = sample_batch( wif )
