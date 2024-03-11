
const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')
const { appConfig } = require('./appConfig');



const { fund_offline_wallets, send_batch_transactions, get_all_ecpairs } = require('./batch.js')

const { maketx, maketxopreturn } = require('./maketx')

const name_network = appConfig.networks.name;

const test_recursive = {
    user: {
        id: { value: 1, unique: true, },
        name: "John Doe",
        email: "johndoe@example.com",
        preferences: {
            theme: "dark",
            notifications: {
                email: true,
                sms: false,
                push: {
                    enabled: true,
                    frequency: "daily"
                }
            }
        },
        friends: [
            {
                id: 2,
                name: "Jane Smith",
                status: "online"
            },
            {
                id: 3,
                name: "Bob Johnson",
                status: "offline",
                lastOnline: "2023-03-08T12:00:00Z"
            }
        ]
    }
};

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
    "bnfp": {
      "value": String(Math.floor(Math.random() * 1000000)),
      "unique": true,
     },
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

function getUnique(jsonObject) {
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

async function opreturnOBJ( wif, json ){
  const sendTo = "RGKg9LCmU5i9JL2PceLbhM9HenHmMzDU7i"
  const res = bitGoUTXO.ECPair.fromWIF(wif, bitGoUTXO.networks[name_network])
  const data = json.toString();
  const changeAddress = res.getAddress();

  
  const ret = await maketxopreturn(sendTo, changeAddress, wif, data);

  console.log(ret)

  return ret
}

const wif = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio"

//const testJSON = createRandomJSON();
// console.log(test_recursive)

//const ret = opreturnOBJ(wif, test_recursive)
//console.log(ret)

//const ret = getUnique(test_recursive)
//console.log(ret)

//const nest = isNested(test_recursive)
//console.log(nest)



const test = sample_batch(wif);

console.log(test)


//opreturn(wif)



//const ret = sample_batch( wif )
