"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveTransfer = exports.RESERVE_TRANSFER_DESTINATION = exports.RESERVE_TRANSFER_ARBITRAGE_ONLY = exports.RESERVE_TRANSFER_CURRENCY_EXPORT = exports.RESERVE_TRANSFER_IDENTITY_EXPORT = exports.RESERVE_TRANSFER_REFUND = exports.RESERVE_TRANSFER_RESERVE_TO_RESERVE = exports.RESERVE_TRANSFER_IMPORT_TO_SOURCE = exports.RESERVE_TRANSFER_BURN_CHANGE_WEIGHT = exports.RESERVE_TRANSFER_BURN_CHANGE_PRICE = exports.RESERVE_TRANSFER_CROSS_SYSTEM = exports.RESERVE_TRANSFER_MINT_CURRENCY = exports.RESERVE_TRANSFER_DOUBLE_SEND = exports.RESERVE_TRANSFER_FEE_OUTPUT = exports.RESERVE_TRANSFER_PRECONVERT = exports.RESERVE_TRANSFER_CONVERT = exports.RESERVE_TRANSFER_VALID = exports.RESERVE_TRANSFER_INVALID = void 0;
const varint_1 = require("../utils/varint");
const bufferutils_1 = require("../utils/bufferutils");
const bn_js_1 = require("bn.js");
const TokenOutput_1 = require("./TokenOutput");
const TransferDestination_1 = require("./TransferDestination");
const address_1 = require("../utils/address");
const vdxf_1 = require("../constants/vdxf");
const { BufferReader, BufferWriter } = bufferutils_1.default;
exports.RESERVE_TRANSFER_INVALID = new bn_js_1.BN(0, 10);
exports.RESERVE_TRANSFER_VALID = new bn_js_1.BN(1, 10);
exports.RESERVE_TRANSFER_CONVERT = new bn_js_1.BN(2, 10);
exports.RESERVE_TRANSFER_PRECONVERT = new bn_js_1.BN(4, 10);
exports.RESERVE_TRANSFER_FEE_OUTPUT = new bn_js_1.BN(8, 10); // one per import, amount must match total percentage of fees for exporter, no pre-convert allowed
exports.RESERVE_TRANSFER_DOUBLE_SEND = new bn_js_1.BN("10", 16); // this is used along with increasing the fee to send one transaction on two hops
exports.RESERVE_TRANSFER_MINT_CURRENCY = new bn_js_1.BN("20", 16); // set when this output is being minted on import
exports.RESERVE_TRANSFER_CROSS_SYSTEM = new bn_js_1.BN("40", 16); // if this is set, there is a systemID serialized and deserialized as well for destination
exports.RESERVE_TRANSFER_BURN_CHANGE_PRICE = new bn_js_1.BN("80", 16); // this output is being burned on import and will change the price
exports.RESERVE_TRANSFER_BURN_CHANGE_WEIGHT = new bn_js_1.BN("100", 16); // this output is being burned on import and will change the reserve ratio
exports.RESERVE_TRANSFER_IMPORT_TO_SOURCE = new bn_js_1.BN("200", 16); // set when the source currency, not destination is the import currency
exports.RESERVE_TRANSFER_RESERVE_TO_RESERVE = new bn_js_1.BN("400", 16); // for arbitrage or transient conversion, 2 stage solving (2nd from new fractional to reserves)
exports.RESERVE_TRANSFER_REFUND = new bn_js_1.BN("800", 16); // this transfer should be refunded, individual property when conversions exceed limits
exports.RESERVE_TRANSFER_IDENTITY_EXPORT = new bn_js_1.BN("1000", 16); // this exports a full identity when the next cross-chain leg is processed
exports.RESERVE_TRANSFER_CURRENCY_EXPORT = new bn_js_1.BN("2000", 16); // this exports a currency definition
exports.RESERVE_TRANSFER_ARBITRAGE_ONLY = new bn_js_1.BN("4000", 16); // in PBaaS V1, one additional reserve transfer from the local system may be added by the importer
exports.RESERVE_TRANSFER_DESTINATION = new TransferDestination_1.TransferDestination({
    type: TransferDestination_1.DEST_PKH,
    destination_bytes: (0, address_1.fromBase58Check)("RTqQe58LSj2yr5CrwYFwcsAQ1edQwmrkUU").hash
});
class ReserveTransfer extends TokenOutput_1.TokenOutput {
    constructor(data) {
        super(data);
        this.flags = exports.RESERVE_TRANSFER_INVALID;
        this.fee_currency_id = null;
        this.fee_amount = new bn_js_1.BN(0, 10);
        this.transfer_destination = new TransferDestination_1.TransferDestination();
        this.dest_currency_id = null;
        this.second_reserve_id = null;
        this.dest_currency_id = null;
        if (data != null) {
            if (data.flags != null)
                this.flags = data.flags;
            if (data.fee_currency_id != null)
                this.fee_currency_id = data.fee_currency_id;
            if (data.fee_amount != null)
                this.fee_amount = data.fee_amount;
            if (data.transfer_destination != null)
                this.transfer_destination = data.transfer_destination;
            if (data.dest_currency_id != null)
                this.dest_currency_id = data.dest_currency_id;
            if (data.second_reserve_id != null)
                this.second_reserve_id = data.second_reserve_id;
            if (data.dest_system_id != null)
                this.dest_system_id = data.dest_system_id;
        }
    }
    isReserveToReserve() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_RESERVE_TO_RESERVE).toNumber());
    }
    isCrossSystem() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_CROSS_SYSTEM).toNumber());
    }
    isConversion() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_CONVERT).toNumber());
    }
    isPreConversion() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_PRECONVERT).toNumber());
    }
    isFeeOutput() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_FEE_OUTPUT).toNumber());
    }
    isDoubleSend() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_DOUBLE_SEND).toNumber());
    }
    isMint() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_MINT_CURRENCY).toNumber());
    }
    isBurnChangeWeight() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_BURN_CHANGE_WEIGHT).toNumber());
    }
    isBurnChangePrice() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_BURN_CHANGE_PRICE).toNumber());
    }
    isImportToSource() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_IMPORT_TO_SOURCE).toNumber());
    }
    isRefund() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_REFUND).toNumber());
    }
    isIdentityExport() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_IDENTITY_EXPORT).toNumber());
    }
    isCurrencyExport() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_CURRENCY_EXPORT).toNumber());
    }
    isArbitrageOnly() {
        return !!(this.flags.and(exports.RESERVE_TRANSFER_ARBITRAGE_ONLY).toNumber());
    }
    getByteLength() {
        let length = super.getByteLength();
        length += varint_1.default.encodingLength(this.flags);
        length += (0, address_1.fromBase58Check)(this.fee_currency_id).hash.length;
        length += varint_1.default.encodingLength(this.fee_amount);
        length += this.transfer_destination.getByteLength();
        length += (0, address_1.fromBase58Check)(this.dest_currency_id).hash.length;
        if (this.isReserveToReserve()) {
            length += (0, address_1.fromBase58Check)(this.second_reserve_id).hash.length;
        }
        if (this.isCrossSystem()) {
            length += (0, address_1.fromBase58Check)(this.dest_system_id).hash.length;
        }
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        const ownOutput = new TokenOutput_1.TokenOutput({
            values: this.reserve_values,
            version: this.version
        });
        writer.writeSlice(ownOutput.toBuffer());
        writer.writeVarInt(this.flags);
        writer.writeSlice((0, address_1.fromBase58Check)(this.fee_currency_id).hash);
        writer.writeVarInt(this.fee_amount);
        writer.writeSlice(this.transfer_destination.toBuffer());
        writer.writeSlice((0, address_1.fromBase58Check)(this.dest_currency_id).hash);
        if (this.isReserveToReserve()) {
            writer.writeSlice((0, address_1.fromBase58Check)(this.second_reserve_id).hash);
        }
        if (this.isCrossSystem()) {
            writer.writeSlice((0, address_1.fromBase58Check)(this.dest_system_id).hash);
        }
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0) {
        const _offset = super.fromBuffer(buffer, offset);
        const reader = new BufferReader(buffer, _offset);
        this.flags = reader.readVarInt();
        this.fee_currency_id = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        this.fee_amount = reader.readVarInt();
        this.transfer_destination = new TransferDestination_1.TransferDestination();
        reader.offset = this.transfer_destination.fromBuffer(buffer, reader.offset);
        this.dest_currency_id = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        if (this.isReserveToReserve()) {
            this.second_reserve_id = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        }
        if (this.isCrossSystem()) {
            this.dest_system_id = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
        }
        return reader.offset;
    }
}
exports.ReserveTransfer = ReserveTransfer;
