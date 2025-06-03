"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerusScript = void 0;
const bufferutils_1 = require("../../utils/bufferutils");
const script_1 = require("../../utils/script");
class VerusScript {
    constructor(chunks = []) {
        this.chunks = chunks;
    }
    getByteLength() {
        return this.internalToBuffer().length;
    }
    fromBuffer(buffer, offset, length) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const _length = length != null ? length : offset != null ? reader.buffer.length - offset : reader.buffer.length;
        this.chunks = (0, script_1.decompile)(reader.readSlice(_length));
        return reader.offset;
    }
    internalToBuffer() {
        return (0, script_1.compile)(this.chunks);
    }
    toBuffer() {
        return this.internalToBuffer();
    }
}
exports.VerusScript = VerusScript;
