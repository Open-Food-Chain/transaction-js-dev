// OP_0 [signatures ...]

var Buffer = require('safe-buffer').Buffer
var bscript = require('../../script')
var p2sto = require('./output')
var typeforce = require('typeforce')
var varuint = require('varuint-bitcoin')
var OPS = require('bitcoin-ops')
const SmartTransactionSignatures = require('../../smart_transaction_signatures')

function partialSignature (value) {
  return value === OPS.OP_0 || bscript.isCanonicalSignature(value)
}

function check (script) {
  var chunks = bscript.decompile(script)
  if (chunks.length != 1) return false

  return SmartTransactionSignatures.fromChunk(chunks[0]).isValid();
}
check.toJSON = function () { return 'smart transaction input' }

function encodeStack (signature) {  
  const smartTxSigs = SmartTransactionSignatures.fromChunk(signature)

  if (smartTxSigs.error == null) return [signature]
  else throw smartTxSigs.error
}

function encode (signatures, scriptPubKey) {
  return bscript.compile(encodeStack(signatures, scriptPubKey))
}

function decodeStack (stack, allowIncomplete) {
  typeforce(check, stack, allowIncomplete)
  return stack.slice(1)
}

function decode (buffer, allowIncomplete) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack, allowIncomplete)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}
