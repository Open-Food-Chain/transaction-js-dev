const maketx = require('./maketx')

const sendTo = [{ "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN":2  }];

( async () => { 
txid = await maketx.maketx( sendTo, "RMNSVdQhbSzBVTGt2SVFtBg7sTbB8mXYwN", "UvjpBLS27ZhBdCyw2hQNrTksQkLWCEvybf4CiqyC6vJNM3cb6Qio")
console.log(txid.data)
})();
