

const config = require('config');
let bitGoUTXO = require('@bitgo/utxo-lib')

const { fund_offline_wallets, send_batch_transactions, get_all_ecpairs } = require('./batch.js')

const name_network = config.get('networks.name')

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

res = bitGoUTXO.ECPair.fromWIF("UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio", bitGoUTXO.networks[name_network])
addy = res.getAddress()

console.log(addy)

ec_pairs = get_all_ecpairs( test_batch, res )

baseAddy = "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN"
baseWIF = "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio";

/*( async () => { 
  const tx1 = await fund_offline_wallets( ec_pairs, baseAddy, baseWIF ) 
  console.log(`fund: ${JSON.stringify(tx1)}`)
})();*/


( async () => { 
  const tx2 = await send_batch_transactions( ec_pairs, test_batch, res )
  console.log(`batch: ${JSON.stringify(tx2)}`)
})();
