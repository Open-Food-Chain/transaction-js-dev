"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusPayInvoiceDetails = exports.VERUSPAY_IS_TESTNET = exports.VERUSPAY_EXCLUDES_VERUS_BLOCKCHAIN = exports.VERUSPAY_ACCEPTS_ANY_AMOUNT = exports.VERUSPAY_ACCEPTS_ANY_DESTINATION = exports.VERUSPAY_EXPIRES = exports.VERUSPAY_ACCEPTS_NON_VERUS_SYSTEMS = exports.VERUSPAY_ACCEPTS_CONVERSION = exports.VERUSPAY_VALID = exports.VERUSPAY_INVALID = void 0;
const varint_1 = require("../../../utils/varint");
const varuint_1 = require("../../../utils/varuint");
const bufferutils_1 = require("../../../utils/bufferutils");
const bn_js_1 = require("bn.js");
const TransferDestination_1 = require("../../../pbaas/TransferDestination");
const address_1 = require("../../../utils/address");
const vdxf_1 = require("../../../constants/vdxf");
const createHash = require("create-hash");
const { BufferReader, BufferWriter } = bufferutils_1.default;
exports.VERUSPAY_INVALID = new bn_js_1.BN(0, 10);
exports.VERUSPAY_VALID = new bn_js_1.BN(1, 10);
exports.VERUSPAY_ACCEPTS_CONVERSION = new bn_js_1.BN(2, 10);
exports.VERUSPAY_ACCEPTS_NON_VERUS_SYSTEMS = new bn_js_1.BN(4, 10);
exports.VERUSPAY_EXPIRES = new bn_js_1.BN(8, 10);
exports.VERUSPAY_ACCEPTS_ANY_DESTINATION = new bn_js_1.BN(16, 0);
exports.VERUSPAY_ACCEPTS_ANY_AMOUNT = new bn_js_1.BN(32, 0);
exports.VERUSPAY_EXCLUDES_VERUS_BLOCKCHAIN = new bn_js_1.BN(64, 0);
exports.VERUSPAY_IS_TESTNET = new bn_js_1.BN(128, 0);
class VerusPayInvoiceDetails {
    constructor(data) {
        this.flags = exports.VERUSPAY_VALID;
        this.amount = null;
        this.destination = null;
        this.requestedcurrencyid = null;
        this.expiryheight = null;
        this.maxestimatedslippage = null;
        this.acceptedsystems = null;
        if (data != null) {
            if (data.flags != null)
                this.flags = data.flags;
            if (data.amount != null)
                this.amount = data.amount;
            if (data.destination != null)
                this.destination = data.destination;
            if (data.requestedcurrencyid != null)
                this.requestedcurrencyid = data.requestedcurrencyid;
            if (data.expiryheight != null)
                this.expiryheight = data.expiryheight;
            if (data.maxestimatedslippage != null)
                this.maxestimatedslippage = data.maxestimatedslippage;
            if (data.acceptedsystems != null)
                this.acceptedsystems = data.acceptedsystems;
        }
    }
    setFlags(flags) {
        if (flags.acceptsConversion)
            this.flags = this.flags.xor(exports.VERUSPAY_ACCEPTS_CONVERSION);
        if (flags.acceptsNonVerusSystems)
            this.flags = this.flags.xor(exports.VERUSPAY_ACCEPTS_NON_VERUS_SYSTEMS);
        if (flags.expires)
            this.flags = this.flags.xor(exports.VERUSPAY_EXPIRES);
        if (flags.acceptsAnyAmount)
            this.flags = this.flags.xor(exports.VERUSPAY_ACCEPTS_ANY_AMOUNT);
        if (flags.acceptsAnyDestination)
            this.flags = this.flags.xor(exports.VERUSPAY_ACCEPTS_ANY_DESTINATION);
        if (flags.excludesVerusBlockchain)
            this.flags = this.flags.xor(exports.VERUSPAY_EXCLUDES_VERUS_BLOCKCHAIN);
        if (flags.isTestnet)
            this.flags = this.flags.xor(exports.VERUSPAY_IS_TESTNET);
    }
    getFlagsJson() {
        return {
            acceptsConversion: this.acceptsConversion(),
            acceptsNonVerusSystems: this.acceptsNonVerusSystems(),
            expires: this.expires(),
            acceptsAnyAmount: this.acceptsAnyAmount(),
            acceptsAnyDestination: this.acceptsAnyDestination(),
            excludesVerusBlockchain: this.excludesVerusBlockchain(),
            isTestnet: this.isTestnet()
        };
    }
    toSha256() {
        return createHash("sha256").update(this.toBuffer()).digest();
    }
    acceptsConversion() {
        return !!(this.flags.and(exports.VERUSPAY_ACCEPTS_CONVERSION).toNumber());
    }
    acceptsNonVerusSystems() {
        return !!(this.flags.and(exports.VERUSPAY_ACCEPTS_NON_VERUS_SYSTEMS).toNumber());
    }
    acceptsAnyAmount() {
        return !!(this.flags.and(exports.VERUSPAY_ACCEPTS_ANY_AMOUNT).toNumber());
    }
    acceptsAnyDestination() {
        return !!(this.flags.and(exports.VERUSPAY_ACCEPTS_ANY_DESTINATION).toNumber());
    }
    expires() {
        return !!(this.flags.and(exports.VERUSPAY_EXPIRES).toNumber());
    }
    excludesVerusBlockchain() {
        return !!(this.flags.and(exports.VERUSPAY_EXCLUDES_VERUS_BLOCKCHAIN).toNumber());
    }
    isTestnet() {
        return !!(this.flags.and(exports.VERUSPAY_IS_TESTNET).toNumber());
    }
    isValid() {
        return (!!(this.flags.and(exports.VERUSPAY_VALID).toNumber()));
    }
    getByteLength() {
        let length = 0;
        length += varint_1.default.encodingLength(this.flags);
        if (!this.acceptsAnyAmount()) {
            length += varint_1.default.encodingLength(this.amount);
        }
        if (!this.acceptsAnyDestination()) {
            length += this.destination.getByteLength();
        }
        length += (0, address_1.fromBase58Check)(this.requestedcurrencyid).hash.length;
        if (this.expires()) {
            length += varint_1.default.encodingLength(this.expiryheight);
        }
        if (this.acceptsConversion()) {
            length += varint_1.default.encodingLength(this.maxestimatedslippage);
        }
        if (this.acceptsNonVerusSystems()) {
            length += varuint_1.default.encodingLength(this.acceptedsystems.length);
            this.acceptedsystems.forEach(() => {
                length += 20;
            });
        }
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        writer.writeVarInt(this.flags);
        if (!this.acceptsAnyAmount())
            writer.writeVarInt(this.amount);
        if (!this.acceptsAnyDestination())
            writer.writeSlice(this.destination.toBuffer());
        writer.writeSlice((0, address_1.fromBase58Check)(this.requestedcurrencyid).hash);
        if (this.expires()) {
            writer.writeVarInt(this.expiryheight);
        }
        if (this.acceptsConversion()) {
            writer.writeVarInt(this.maxestimatedslippage);
        }
        if (this.acceptsNonVerusSystems()) {
            writer.writeArray(this.acceptedsystems.map(x => (0, address_1.fromBase58Check)(x).hash));
        }
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new BufferReader(buffer, offset);
        this.flags = reader.readVarInt();
        if (!this.acceptsAnyAmount())
            this.amount = reader.readVarInt();
        if (!this.acceptsAnyDestination()) {
            this.destination = new TransferDestination_1.TransferDestination();
            reader.offset = this.destination.fromBuffer(buffer, reader.offset);
        }
        this.requestedcurrencyid = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        if (this.expires()) {
            this.expiryheight = reader.readVarInt();
        }
        if (this.acceptsConversion()) {
            this.maxestimatedslippage = reader.readVarInt();
        }
        if (this.acceptsNonVerusSystems()) {
            const acceptedSystemsBuffers = reader.readArray(20);
            this.acceptedsystems = acceptedSystemsBuffers.map(x => (0, address_1.toBase58Check)(x, vdxf_1.I_ADDR_VERSION));
        }
        return reader.offset;
    }
    static fromJson(data) {
        return new VerusPayInvoiceDetails({
            flags: new bn_js_1.BN(data.flags),
            amount: data.amount != null ? new bn_js_1.BN(data.amount) : undefined,
            destination: data.destination != null ? TransferDestination_1.TransferDestination.fromJson(data.destination) : undefined,
            requestedcurrencyid: data.requestedcurrencyid,
            expiryheight: data.expiryheight != null ? new bn_js_1.BN(data.expiryheight) : undefined,
            maxestimatedslippage: data.maxestimatedslippage != null ? new bn_js_1.BN(data.maxestimatedslippage) : undefined,
            acceptedsystems: data.acceptedsystems
        });
    }
    toJson() {
        return {
            flags: this.flags.toString(),
            amount: this.acceptsAnyAmount() ? undefined : this.amount.toString(),
            destination: this.acceptsAnyDestination() ? undefined : this.destination.toJson(),
            requestedcurrencyid: this.requestedcurrencyid,
            expiryheight: this.expires() ? this.expiryheight.toString() : undefined,
            maxestimatedslippage: this.acceptsConversion() ? this.maxestimatedslippage.toString() : undefined,
            acceptedsystems: this.acceptsNonVerusSystems() ? this.acceptedsystems : undefined,
        };
    }
}
exports.VerusPayInvoiceDetails = VerusPayInvoiceDetails;
