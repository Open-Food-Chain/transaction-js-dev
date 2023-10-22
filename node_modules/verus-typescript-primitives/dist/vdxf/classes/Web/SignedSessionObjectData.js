"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedSessionObjectData = void 0;
const __1 = require("../../");
const bufferutils_1 = require("../../../utils/bufferutils");
const varuint_1 = require("../../../utils/varuint");
const Hash160_1 = require("../Hash160");
class SignedSessionObjectData extends __1.VDXFObject {
    constructor(data = {
        session_id: "",
        timestamp_micro: 0,
        body: ""
    }) {
        super(__1.SIGNED_SESSION_OBJECT_DATA.vdxfid);
        this.session_id = data.session_id;
        if (isNaN(data.timestamp_micro)) {
            this.timestamp_micro = 0;
        }
        else {
            this.timestamp_micro = data.timestamp_micro;
        }
        this.body = data.body;
    }
    dataByteLength() {
        let length = 0;
        const _session_id = Hash160_1.Hash160.fromAddress(this.session_id, false);
        const _body = Buffer.from(this.body, 'utf8');
        length += _session_id.byteLength();
        length += 8; // timestamp_micro
        length += varuint_1.default.encodingLength(_body.length);
        length += _body.length;
        return length;
    }
    toDataBuffer() {
        const buffer = Buffer.alloc(this.dataByteLength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        const _session_id = Hash160_1.Hash160.fromAddress(this.session_id, false);
        const _body = Buffer.from(this.body, 'utf8');
        writer.writeSlice(_session_id.toBuffer());
        writer.writeUInt64(this.timestamp_micro);
        writer.writeVarSlice(_body);
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const length = reader.readCompactSize();
        if (length == 0) {
            throw new Error("Cannot create signed session object data from empty buffer");
        }
        else {
            const _session_id = new Hash160_1.Hash160();
            reader.offset = _session_id.fromBuffer(reader.buffer, false, reader.offset);
            this.session_id = _session_id.toAddress();
            this.timestamp_micro = reader.readUInt64();
            this.body = reader.readVarSlice().toString('utf-8');
        }
        return reader.offset;
    }
    toJson() {
        return {
            session_id: this.session_id,
            timestamp_micro: this.timestamp_micro,
            body: this.body
        };
    }
}
exports.SignedSessionObjectData = SignedSessionObjectData;
