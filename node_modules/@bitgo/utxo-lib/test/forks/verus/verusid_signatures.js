/* global describe, it */

var assert = require('assert')
var ECPair = require('../../../src/ecpair')

const {
  IdentitySignature,
  networks
} = require('../../../src')

describe('VerusID Signer and Verifier (verustest)', function () {
  var network = networks['verustest']
  const keyPair = ECPair.fromWIF('UrEJQMk9PD4Fo9i8FNb1ZSFRrC9TrD4j6CGbFvbFHVH83bStroHH', network)

  it('Sign and verify message with VerusID version 1 signatures', function () {
    const version = 1
    const hashType = 1
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
    const msg = 'signedmessage'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)
    sig.signMessageOffline(msg, keyPair)
    const verificationResult = sig.verifyMessageOffline(msg, keyPair.getAddress())[0]

    assert.equal(
      sig.toBuffer().toString('base64'),
      'AfdGAAABQSDLWEju39WoEBsEmkzWLIoCjvGUhDkom/exPHNytst+vnYgBy7+z+eUOV5jFr5atSUkADYST7V2Ji0nxrg8C0Vv'
    )
    assert.equal(verificationResult, true)
  })

  it('Sign and verify hash with VerusID version 1 signatures', function () {
    const version = 1
    const hashType = 1
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)

    const hash = sig.hashMessage('signedmessage')

    sig.signHashOffline(hash, keyPair)
    const verificationResult = sig.verifyHashOffline(hash, keyPair.getAddress())[0]

    assert.equal(
      sig.toBuffer().toString('base64'),
      'AfdGAAABQSDLWEju39WoEBsEmkzWLIoCjvGUhDkom/exPHNytst+vnYgBy7+z+eUOV5jFr5atSUkADYST7V2Ji0nxrg8C0Vv'
    )
    assert.equal(verificationResult, true)
  })

  it('Sign and verify longer hash with VerusID version 1 signatures', function () {
    const version = 1
    const hashType = 1
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)

    const hash = sig.hashMessage('signedmessagelongershouldtriggerlengtherrorsifwrittenincorrectly')

    sig.signHashOffline(hash, keyPair)
    const verificationResult = sig.verifyHashOffline(hash, keyPair.getAddress())[0]

    assert.equal(verificationResult, true)
  })

  it('Verify version 1 signature', function () {
    const sig = new IdentitySignature(network)
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
    const msg = 'signedmessage'
    const wrongmsg = 'notsignedmessage'

    sig.fromBuffer(
      Buffer.from(
        'AfdGAAABQSDLWEju39WoEBsEmkzWLIoCjvGUhDkom/exPHNytst+vnYgBy7+z+eUOV5jFr5atSUkADYST7V2Ji0nxrg8C0Vv',
        'base64'
      ),
      0,
      chainId,
      iAddress
    )

    assert.equal(
      sig.verifyMessageOffline(
        msg,
        keyPair.getAddress()
      )[0],
      true
    )
    assert.equal(
      sig.verifyMessageOffline(
        wrongmsg,
        keyPair.getAddress()
      )[0],
      false
    )
  })

  it('Sign and verify message with VerusID version 2 signatures', function () {
    const version = 2
    const hashType = 5
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
    const msg = 'signedmessage'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)
    sig.signMessageOffline(msg, keyPair)
    const verificationResult = sig.verifyMessageOffline(msg, keyPair.getAddress())[0]

    assert.equal(
      sig.toBuffer().toString('base64'),
      'AgX3RgAAAUEgy1hI7t/VqBAbBJpM1iyKAo7xlIQ5KJv3sTxzcrbLfr52IAcu/s/nlDleYxa+WrUlJAA2Ek+1diYtJ8a4PAtFbw=='
    )
    assert.equal(verificationResult, true)
  })

  it('Sign and verify hash with VerusID version 2 signatures', function () {
    const version = 2
    const hashType = 5
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)

    const hash = sig.hashMessage('signedmessage')

    sig.signHashOffline(hash, keyPair)
    const verificationResult = sig.verifyHashOffline(hash, keyPair.getAddress())[0]

    assert.equal(
      sig.toBuffer().toString('base64'),
      'AgX3RgAAAUEgy1hI7t/VqBAbBJpM1iyKAo7xlIQ5KJv3sTxzcrbLfr52IAcu/s/nlDleYxa+WrUlJAA2Ek+1diYtJ8a4PAtFbw=='
    )
    assert.equal(verificationResult, true)
  })

  it('Sign and verify longer hash with VerusID version 2 signatures', function () {
    const version = 2
    const hashType = 5
    const blockHeight = 18167
    const signatures = null
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'

    const sig = new IdentitySignature(network, version, hashType, blockHeight, signatures, chainId, iAddress)

    const hash = sig.hashMessage('signedmessagelongershouldtriggerlengtherrorsifwrittenincorrectly')

    sig.signHashOffline(hash, keyPair)
    const verificationResult = sig.verifyHashOffline(hash, keyPair.getAddress())[0]

    assert.equal(verificationResult, true)
  })

  it('Verify version 2 signature', function () {
    const sig = new IdentitySignature(network)
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
    const msg = 'signedmessage'
    const wrongmsg = 'notsignedmessage'

    sig.fromBuffer(
      Buffer.from(
        'AgX3RgAAAUEgy1hI7t/VqBAbBJpM1iyKAo7xlIQ5KJv3sTxzcrbLfr52IAcu/s/nlDleYxa+WrUlJAA2Ek+1diYtJ8a4PAtFbw==',
        'base64'
      ),
      0,
      chainId,
      iAddress
    )

    assert.equal(
      sig.verifyMessageOffline(
        msg,
        keyPair.getAddress()
      )[0],
      true
    )
    assert.equal(
      sig.verifyMessageOffline(
        wrongmsg,
        keyPair.getAddress()
      )[0],
      false
    )
  })

  it('Reject signature with incorrect recid', function () {
    const sig = new IdentitySignature(network)
    const chainId = 'iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq'
    const iAddress = 'i8jHXEEYEQ7KEoYe6eKXBib8cUBZ6vjWSd'
    const msg = 'signedmessage'

    sig.fromBuffer(
      Buffer.from(
        'AfdGAAABQR/LWEju39WoEBsEmkzWLIoCjvGUhDkom/exPHNytst+vnYgBy7+z+eUOV5jFr5atSUkADYST7V2Ji0nxrg8C0Vv',
        'base64'
      ),
      0,
      chainId,
      iAddress
    )

    assert.equal(
      sig.verifyMessageOffline(
        msg,
        keyPair.getAddress()
      )[0],
      false
    )
  })
})
