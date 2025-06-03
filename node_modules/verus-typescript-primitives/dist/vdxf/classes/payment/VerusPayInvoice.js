"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusPayInvoice = exports.VERUSPAY_VERSION_MASK = exports.VERUSPAY_VERSION_SIGNED = exports.VERUSPAY_VERSION_LASTVALID = exports.VERUSPAY_VERSION_FIRSTVALID = exports.VERUSPAY_VERSION_CURRENT = void 0;
const __1 = require("../../");
const keys_1 = require("../../keys");
const Hash160_1 = require("./../Hash160");
const bufferutils_1 = require("../../../utils/bufferutils");
const vdxf_1 = require("../../../constants/vdxf");
const address_1 = require("../../../utils/address");
const createHash = require("create-hash");
const base64url_1 = require("base64url");
const VerusPayInvoiceDetails_1 = require("./VerusPayInvoiceDetails");
const bn_js_1 = require("bn.js");
exports.VERUSPAY_VERSION_CURRENT = new bn_js_1.BN(3, 10);
exports.VERUSPAY_VERSION_FIRSTVALID = new bn_js_1.BN(3, 10);
exports.VERUSPAY_VERSION_LASTVALID = new bn_js_1.BN(3, 10);
exports.VERUSPAY_VERSION_SIGNED = new bn_js_1.BN('80000000', 16);
exports.VERUSPAY_VERSION_MASK = exports.VERUSPAY_VERSION_SIGNED;
class VerusPayInvoice extends __1.VDXFObject {
    constructor(request = {
        details: new VerusPayInvoiceDetails_1.VerusPayInvoiceDetails(),
    }) {
        super(__1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid);
        this.system_id = request.system_id;
        this.signing_id = request.signing_id;
        this.signature = request.signature
            ? new __1.VerusIDSignature(request.signature, keys_1.IDENTITY_AUTH_SIG_VDXF_KEY, false)
            : undefined;
        this.details = new VerusPayInvoiceDetails_1.VerusPayInvoiceDetails(request.details);
        if (request.version)
            this.version = request.version;
        else
            this.version = exports.VERUSPAY_VERSION_CURRENT;
    }
    getVersionNoFlags() {
        return this.version.and(exports.VERUSPAY_VERSION_MASK.notn(exports.VERUSPAY_VERSION_MASK.bitLength()));
    }
    isValidVersion() {
        return this.getVersionNoFlags().gte(exports.VERUSPAY_VERSION_FIRSTVALID) && this.getVersionNoFlags().lte(exports.VERUSPAY_VERSION_LASTVALID);
    }
    isSigned() {
        return !!(this.version.and(exports.VERUSPAY_VERSION_SIGNED).toNumber());
    }
    setSigned() {
        this.version = this.version.xor(exports.VERUSPAY_VERSION_SIGNED);
    }
    getDetailsHash(signedBlockheight, signatureVersion = 2) {
        if (this.isSigned()) {
            var heightBufferWriter = new bufferutils_1.default.BufferWriter(Buffer.allocUnsafe(4));
            heightBufferWriter.writeUInt32(signedBlockheight);
            if (signatureVersion === 1) {
                return createHash("sha256")
                    .update(vdxf_1.VERUS_DATA_SIGNATURE_PREFIX)
                    .update((0, address_1.fromBase58Check)(this.system_id).hash)
                    .update(heightBufferWriter.buffer)
                    .update((0, address_1.fromBase58Check)(this.signing_id).hash)
                    .update(this.details.toSha256())
                    .digest();
            }
            else {
                return createHash("sha256")
                    .update((0, address_1.fromBase58Check)(this.system_id).hash)
                    .update(heightBufferWriter.buffer)
                    .update((0, address_1.fromBase58Check)(this.signing_id).hash)
                    .update(vdxf_1.VERUS_DATA_SIGNATURE_PREFIX)
                    .update(this.details.toSha256())
                    .digest();
            }
        }
        else
            return this.details.toSha256();
    }
    _dataByteLength(signer = this.signing_id) {
        if (this.isSigned()) {
            let length = 0;
            const _signature = this.signature
                ? this.signature
                : new __1.VerusIDSignature({ signature: "" }, keys_1.IDENTITY_AUTH_SIG_VDXF_KEY, false);
            const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
            length += _system_id.byteLength();
            const _signing_id = Hash160_1.Hash160.fromAddress(signer);
            length += _signing_id.byteLength();
            length += _signature.byteLength();
            length += this.details.getByteLength();
            return length;
        }
        else
            return this.details.getByteLength();
    }
    _toDataBuffer(signer = this.signing_id) {
        const writer = new bufferutils_1.default.BufferWriter(Buffer.alloc(this.dataByteLength()));
        if (this.isSigned()) {
            const _signing_id = Hash160_1.Hash160.fromAddress(signer);
            const _signature = this.signature
                ? this.signature
                : new __1.VerusIDSignature({ signature: "" }, keys_1.IDENTITY_AUTH_SIG_VDXF_KEY, false);
            const _system_id = Hash160_1.Hash160.fromAddress(this.system_id);
            writer.writeSlice(_system_id.toBuffer());
            writer.writeSlice(_signing_id.toBuffer());
            writer.writeSlice(_signature.toBuffer());
        }
        writer.writeSlice(this.details.toBuffer());
        return writer.buffer;
    }
    dataByteLength() {
        return this._dataByteLength();
    }
    toDataBuffer() {
        return this._toDataBuffer();
    }
    _fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const reqLength = reader.readCompactSize();
        if (reqLength == 0) {
            throw new Error("Cannot create request from empty buffer");
        }
        else {
            if (this.isSigned()) {
                this.system_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
                this.signing_id = (0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION);
                const _sig = new __1.VerusIDSignature(undefined, keys_1.IDENTITY_AUTH_SIG_VDXF_KEY, false);
                reader.offset = _sig.fromBuffer(reader.buffer, reader.offset, keys_1.IDENTITY_AUTH_SIG_VDXF_KEY.vdxfid);
                this.signature = _sig;
            }
            const _details = new VerusPayInvoiceDetails_1.VerusPayInvoiceDetails();
            reader.offset = _details.fromBuffer(reader.buffer, reader.offset);
            this.details = _details;
        }
        return reader.offset;
    }
    fromDataBuffer(buffer, offset) {
        return this._fromDataBuffer(buffer, offset);
    }
    toWalletDeeplinkUri() {
        return `${__1.WALLET_VDXF_KEY.vdxfid.toLowerCase()}://x-callback-url/${__1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid}/${this.toString(false)}`;
    }
    static fromWalletDeeplinkUri(uri) {
        const split = uri.split(`${__1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid}/`);
        const inv = new VerusPayInvoice();
        inv.fromBuffer(base64url_1.default.toBuffer(split[1]), 0, __1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid);
        return inv;
    }
    toQrString() {
        return this.toString(true);
    }
    static fromQrString(qrstring) {
        const inv = new VerusPayInvoice();
        inv.fromBuffer(base64url_1.default.toBuffer(qrstring), 0);
        return inv;
    }
    static fromJson(data) {
        return new VerusPayInvoice({
            details: VerusPayInvoiceDetails_1.VerusPayInvoiceDetails.fromJson(data.details),
            signature: data.signature != null ? __1.VerusIDSignature.fromJson(data.signature) : undefined,
            signing_id: data.signing_id,
            system_id: data.system_id,
            version: new bn_js_1.BN(data.version)
        });
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            system_id: this.system_id,
            signing_id: this.signing_id,
            signature: this.isSigned() ? this.signature.toJson() : this.signature,
            details: this.details.toJson(),
            version: this.version.toString()
        };
    }
}
exports.VerusPayInvoice = VerusPayInvoice;
