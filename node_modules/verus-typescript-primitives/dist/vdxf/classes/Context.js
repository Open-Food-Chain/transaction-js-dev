"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const __1 = require("..");
const vdxf_1 = require("../../constants/vdxf");
const address_1 = require("../../utils/address");
const bufferutils_1 = require("../../utils/bufferutils");
const varuint_1 = require("../../utils/varuint");
class Context extends __1.VDXFObject {
    constructor(kv = {}, vdxfkey = __1.LOGIN_CONSENT_CONTEXT_VDXF_KEY.vdxfid) {
        super(vdxfkey);
        this.kv = kv;
    }
    dataByteLength() {
        let length = 0;
        const keys = Object.keys(this.kv);
        length += varuint_1.default.encodingLength(keys.length);
        for (const key of keys) {
            const value = this.kv[key];
            if (value != null) {
                const valueBuf = Buffer.from(value, "utf-8");
                length += (0, address_1.fromBase58Check)(key).hash.length;
                length += valueBuf.length + varuint_1.default.encodingLength(valueBuf.length);
            }
        }
        return length;
    }
    toDataBuffer() {
        const buffer = Buffer.alloc(this.dataByteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        const keys = Object.keys(this.kv);
        writer.writeCompactSize(keys.length);
        for (const key of Object.keys(this.kv)) {
            const value = this.kv[key];
            const valueBuf = Buffer.from(value, "utf-8");
            writer.writeSlice((0, address_1.fromBase58Check)(key).hash);
            writer.writeVarSlice(valueBuf);
        }
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const contextLength = reader.readCompactSize();
        if (contextLength == 0) {
            this.kv = {};
            return reader.offset;
        }
        else {
            const numKeys = reader.readCompactSize();
            for (let i = 0; i < numKeys; i++) {
                this.kv[(0, address_1.toBase58Check)(reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH), vdxf_1.I_ADDR_VERSION)] = reader.readVarSlice().toString("utf-8");
            }
            return reader.offset;
        }
    }
    toJson() {
        return {
            kv: this.kv,
            vdxfkey: this.vdxfkey,
        };
    }
}
exports.Context = Context;
