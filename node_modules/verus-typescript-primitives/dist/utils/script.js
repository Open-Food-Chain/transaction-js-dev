"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefinedHashType = exports.isCanonicalPubKey = exports.fromASM = exports.toASM = exports.decompile = exports.compile = exports.asMinimalOP = exports.isPushOnly = exports.isPushOnlyChunk = exports.isOPInt = void 0;
const pushdata = require("./pushdata");
const ops_1 = require("./ops");
const reverseops_1 = require("./reverseops");
const string_1 = require("./string");
const OP_INT_BASE = ops_1.OPS.OP_RESERVED; // OP_1 - 1
function isOPInt(value) {
    return ((value === ops_1.OPS.OP_0) ||
        (value >= ops_1.OPS.OP_1 && value <= ops_1.OPS.OP_16) ||
        (value === ops_1.OPS.OP_1NEGATE));
}
exports.isOPInt = isOPInt;
function isPushOnlyChunk(value) {
    return Buffer.isBuffer(value) || isOPInt(value);
}
exports.isPushOnlyChunk = isPushOnlyChunk;
function isPushOnly(value) {
    return value.every(isPushOnlyChunk);
}
exports.isPushOnly = isPushOnly;
function asMinimalOP(buffer) {
    if (buffer.length === 0)
        return ops_1.OPS.OP_0;
    if (buffer.length !== 1)
        return;
    if (buffer[0] >= 1 && buffer[0] <= 16)
        return OP_INT_BASE + buffer[0];
    if (buffer[0] === 0x81)
        return ops_1.OPS.OP_1NEGATE;
}
exports.asMinimalOP = asMinimalOP;
function compile(chunks) {
    if (Buffer.isBuffer(chunks))
        return chunks;
    const bufferSize = chunks.reduce(function (accum, chunk) {
        if (Buffer.isBuffer(chunk)) {
            // adhere to BIP62.3, minimal push policy
            if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
                return accum + 1;
            }
            return accum + pushdata.encodingLength(chunk.length) + chunk.length;
        }
        else {
            // opcode
            return accum + 1;
        }
    }, 0.0);
    var buffer = Buffer.alloc(bufferSize);
    var offset = 0;
    chunks.forEach(function (chunk) {
        // data chunk
        if (Buffer.isBuffer(chunk)) {
            // adhere to BIP62.3, minimal push policy
            var opcode = asMinimalOP(chunk);
            if (opcode !== undefined) {
                buffer.writeUInt8(opcode, offset);
                offset += 1;
                return;
            }
            offset += pushdata.encode(buffer, chunk.length, offset);
            chunk.copy(buffer, offset);
            offset += chunk.length;
            // opcode
        }
        else {
            buffer.writeUInt8(chunk, offset);
            offset += 1;
        }
    });
    if (offset !== buffer.length)
        throw new Error('Could not decode chunks');
    return buffer;
}
exports.compile = compile;
function decompile(buffer) {
    if (Array.isArray(buffer))
        return buffer;
    var chunks = [];
    var i = 0;
    while (i < buffer.length) {
        var opcode = buffer[i];
        // data chunk
        if ((opcode > ops_1.OPS.OP_0) && (opcode <= ops_1.OPS.OP_PUSHDATA4)) {
            var d = pushdata.decode(buffer, i);
            // did reading a pushDataInt fail? empty script
            if (d === null)
                return [];
            i += d.size;
            // attempt to read too much data? empty script
            if (i + d.number > buffer.length)
                return [];
            var data = Buffer.from(buffer.subarray(i, i + d.number));
            i += d.number;
            // decompile minimally
            var op = asMinimalOP(data);
            if (op !== undefined) {
                chunks.push(op);
            }
            else {
                chunks.push(data);
            }
        }
        else {
            chunks.push(opcode);
            i += 1;
        }
    }
    return chunks;
}
exports.decompile = decompile;
function toASM(chunks) {
    if (Buffer.isBuffer(chunks)) {
        chunks = decompile(chunks);
    }
    return chunks.map(function (chunk) {
        // data?
        if (Buffer.isBuffer(chunk)) {
            var op = asMinimalOP(chunk);
            if (op === undefined)
                return chunk.toString('hex');
            chunk = op;
        }
        // opcode!
        return reverseops_1.default[chunk];
    }).join(' ');
}
exports.toASM = toASM;
function fromASM(asm) {
    return compile(asm.split(' ').map(function (chunkStr) {
        // opcode?
        if (ops_1.OPS[chunkStr] !== undefined)
            return ops_1.OPS[chunkStr];
        if (!(0, string_1.isHexString)(chunkStr))
            throw new Error("Expected hex in fromASM");
        // data!
        return Buffer.from(chunkStr, 'hex');
    }));
}
exports.fromASM = fromASM;
function isCanonicalPubKey(buffer) {
    if (!Buffer.isBuffer(buffer))
        return false;
    if (buffer.length < 33)
        return false;
    switch (buffer[0]) {
        case 0x02:
        case 0x03:
            return buffer.length === 33;
        case 0x04:
            return buffer.length === 65;
    }
    return false;
}
exports.isCanonicalPubKey = isCanonicalPubKey;
function isDefinedHashType(hashType) {
    var hashTypeMod = hashType & ~0xc0;
    return hashTypeMod > 0x00 && hashTypeMod < 0x04;
}
exports.isDefinedHashType = isDefinedHashType;
