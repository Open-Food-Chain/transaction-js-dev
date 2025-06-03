"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VdxfUniValue = exports.VDXF_UNI_VALUE_VERSION_CURRENT = exports.VDXF_UNI_VALUE_VERSION_INVALID = void 0;
const varuint_1 = require("../utils/varuint");
const bufferutils_1 = require("../utils/bufferutils");
const address_1 = require("../utils/address");
const vdxf_1 = require("../constants/vdxf");
const bn_js_1 = require("bn.js");
const vdxf_2 = require("../vdxf");
const varint_1 = require("../utils/varint");
exports.VDXF_UNI_VALUE_VERSION_INVALID = new bn_js_1.BN(0, 10);
exports.VDXF_UNI_VALUE_VERSION_CURRENT = new bn_js_1.BN(1, 10);
const { BufferWriter, BufferReader } = bufferutils_1.default;
// This UniValue class was adapted from C++ code for encoding JSON objects into bytes. It is not serialization and
// therefore doesn't have a fromBuffer function, as you can't reliably decode it, only encode.
class VdxfUniValue {
    constructor(data) {
        if (data === null || data === void 0 ? void 0 : data.values)
            this.values = data.values;
        if (data === null || data === void 0 ? void 0 : data.version)
            this.version = data.version;
        else
            this.version = exports.VDXF_UNI_VALUE_VERSION_CURRENT;
    }
    getByteLength() {
        let length = 0;
        for (const key of this.values.keys()) {
            const value = this.values.get(key);
            length += vdxf_1.HASH160_BYTE_LENGTH;
            length += varint_1.default.encodingLength(this.version);
            if (key == vdxf_2.DATA_TYPE_STRING.vdxfid) {
                const valueString = value;
                const valBuf = Buffer.from(valueString, 'utf8');
                //NOTE 3 is from ss type + ver + vdxfidver 
                length += varint_1.default.encodingLength(new bn_js_1.BN(valBuf.length + 3));
                length += varuint_1.default.encodingLength(valBuf.length);
                length += valBuf.length;
            }
            else
                throw new Error("Invalid or unrecognized vdxf key for object type");
        }
        return length;
    }
    toBuffer() {
        const writer = new BufferWriter(Buffer.alloc(this.getByteLength()));
        for (const key of this.values.keys()) {
            const value = this.values.get(key);
            writer.writeSlice((0, address_1.fromBase58Check)(key).hash);
            writer.writeVarInt(this.version);
            if (key == vdxf_2.DATA_TYPE_STRING.vdxfid) {
                const valueString = value;
                const valBuf = Buffer.from(valueString, 'utf8');
                //NOTE 3 is from ss type + ver + vdxfidver 
                writer.writeVarInt(new bn_js_1.BN(valBuf.length + 3));
                writer.writeVarSlice(valBuf);
            }
            else
                throw new Error("Invalid or unrecognized vdxf key for object type");
        }
        return writer.buffer;
    }
    fromBuffer(buffer, offset = 0, keylist = []) {
        const reader = new BufferReader(buffer, offset);
        let lastPrereadOffset = reader.offset;
        function readNextKey() {
            lastPrereadOffset = reader.offset;
            try {
                return (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            }
            catch (e) {
                return null;
            }
        }
        this.values = new Map();
        for (const key of keylist) {
            const dataTypeKey = readNextKey();
            this.version = reader.readVarInt();
            if (this.version.gt(exports.VDXF_UNI_VALUE_VERSION_CURRENT))
                throw new Error("Unknown VDXFUniValue version");
            if (dataTypeKey == vdxf_2.DATA_TYPE_STRING.vdxfid) {
                reader.readVarInt();
                const slice = reader.readVarSlice();
                this.values.set(dataTypeKey, slice.toString('utf8'));
            }
            else {
                throw new Error("Invalid or unrecognized vdxf key for object type");
            }
        }
        return reader.offset;
    }
    static fromJson(obj) {
        const map = new Map();
        for (const key in obj) {
            map.set(key, obj[key]);
        }
        return new VdxfUniValue({
            values: map
        });
    }
    toJson() {
        const ret = {};
        for (const key of this.values.keys()) {
            ret[key] = this.values.get(key);
        }
        return ret;
    }
}
exports.VdxfUniValue = VdxfUniValue;
