"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusIDSignature = exports.Utf8OrBase58Object = exports.HexDataVdxfObject = exports.Utf8DataVdxfObject = exports.BufferDataVdxfObject = exports.VDXFObject = void 0;
const base64url_1 = require("base64url");
const createHash = require("create-hash");
const vdxf_1 = require("../constants/vdxf");
const address_1 = require("../utils/address");
const bufferutils_1 = require("../utils/bufferutils");
const varint_1 = require("../utils/varint");
const varuint_1 = require("../utils/varuint");
const Hash160_1 = require("./classes/Hash160");
const keys_1 = require("./keys");
const bn_js_1 = require("bn.js");
__exportStar(require("./keys"), exports);
__exportStar(require("./scopes"), exports);
class VDXFObject {
    constructor(key = "") {
        this.vdxfkey = key;
        this.version = vdxf_1.DEFAULT_VERSION;
    }
    toJson() {
        return {};
    }
    toString() {
        return base64url_1.default.encode(this.toBuffer());
    }
    dataByteLength() {
        return 0;
    }
    toDataBuffer() {
        return Buffer.alloc(0);
    }
    fromDataBuffer(buffer, offset = 0) {
        return offset;
    }
    fromBuffer(buffer, offset = 0) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const keyHash = reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH);
        const version = reader.readVarInt();
        this.vdxfkey = (0, address_1.toBase58Check)(keyHash, vdxf_1.I_ADDR_VERSION);
        this.version = version.toNumber();
        if (offset < buffer.length - 1) {
            reader.offset = this.fromDataBuffer(reader.buffer, reader.offset);
        }
        return reader.offset;
    }
    byteLength() {
        const dataLength = this.dataByteLength();
        const keyLength = (0, address_1.fromBase58Check)(this.vdxfkey).hash.length;
        const versionEncodingLength = varint_1.default.encodingLength(new bn_js_1.BN(this.version));
        const dataEncodingLength = varuint_1.default.encodingLength(dataLength);
        return dataLength + keyLength + versionEncodingLength + dataEncodingLength;
    }
    toBuffer() {
        const key = (0, address_1.fromBase58Check)(this.vdxfkey);
        const dataLength = this.dataByteLength();
        const buffer = Buffer.alloc(this.byteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        writer.writeSlice(key.hash);
        writer.writeVarInt(new bn_js_1.BN(this.version, 10));
        if (dataLength) {
            writer.writeVarSlice(this.toDataBuffer());
        }
        return writer.buffer;
    }
    toSha256() {
        return createHash("sha256").update(this.toBuffer()).digest();
    }
}
exports.VDXFObject = VDXFObject;
class BufferDataVdxfObject extends VDXFObject {
    constructor(data = "", vdxfkey = "", encoding = "hex") {
        super(vdxfkey);
        this.encoding = "hex";
        this.data = data;
        this.encoding = encoding;
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return Buffer.from(this.data, this.encoding);
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.data = reader.readVarSlice().toString(this.encoding);
        return reader.offset;
    }
    toJson() {
        return {
            data: this.data,
            vdxfkey: this.vdxfkey,
        };
    }
}
exports.BufferDataVdxfObject = BufferDataVdxfObject;
class Utf8DataVdxfObject extends BufferDataVdxfObject {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey, "utf-8");
    }
}
exports.Utf8DataVdxfObject = Utf8DataVdxfObject;
class HexDataVdxfObject extends BufferDataVdxfObject {
    constructor(data = "", vdxfkey = "") {
        super(data, vdxfkey, "hex");
    }
}
exports.HexDataVdxfObject = HexDataVdxfObject;
class Utf8OrBase58Object extends VDXFObject {
    constructor(data = "", vdxfkey = "", base58Keys = []) {
        super(vdxfkey);
        // VDXF keys that would cause this object to be base58 instead of utf8
        this.base58Keys = {};
        for (const key of base58Keys) {
            this.base58Keys[key] = true;
        }
        this.data = data;
    }
    isBase58() {
        return this.base58Keys[this.vdxfkey];
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return this.isBase58()
            ? (Hash160_1.Hash160.fromAddress(this.data, false)).toBuffer()
            : Buffer.from(this.data, "utf-8");
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        if (this.isBase58()) {
            const _data = new Hash160_1.Hash160();
            // varlength is set to true here because vdxf objects always have a 
            // variable length data field. This has160 object was not creted with
            // varlength true, but this is a shortcut instead of writing readVarSlice 
            // and then fromBuffer. 
            reader.offset = _data.fromBuffer(reader.buffer, true, reader.offset);
            _data.varlength = false;
            this.data = _data.toAddress();
        }
        else {
            this.data = reader.readVarSlice().toString('utf-8');
        }
        return reader.offset;
    }
    toJson() {
        return {
            data: this.data,
            vdxfkey: this.vdxfkey,
        };
    }
}
exports.Utf8OrBase58Object = Utf8OrBase58Object;
class VerusIDSignature extends VDXFObject {
    constructor(sig = { signature: "" }, vdxfkey = keys_1.LOGIN_CONSENT_RESPONSE_SIG_VDXF_KEY) {
        super(vdxfkey.vdxfid);
        this.signature = sig.signature;
    }
    dataByteLength() {
        return this.toDataBuffer().length;
    }
    toDataBuffer() {
        return Buffer.from(this.signature, "base64");
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        this.signature = reader.readVarSlice().toString("base64");
        return reader.offset;
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            signature: this.signature,
        };
    }
}
exports.VerusIDSignature = VerusIDSignature;
