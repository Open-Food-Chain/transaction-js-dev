const appConfig = {
  test: "test",
  explorer: {
    base_url: "https://blockchain-explorer.occ.openfoodchain.org/insight-api-komodo/",
    address_url_ext: "addrs/",
    utxo_url_ext: "/utxo",
    send_url: "https://blockchain-explorer.occ.openfoodchain.org/insight-api-komodo/tx/send",
  },
  networks: {
    name: "kmd",
  },
  batch: {
    min_utxos: 30,
  },
};

module.exports = { appConfig };
