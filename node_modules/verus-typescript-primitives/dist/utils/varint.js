"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Signed varints
const bn_js_1 = require("bn.js");
const writeVarInt = (number) => {
    let tmp = [];
    let len = 0;
    while (true) {
        tmp[len] = (number.and(new bn_js_1.BN('7f', 16))).or(new bn_js_1.BN(len ? '80' : '00', 'hex')).toBuffer()[0];
        if (number.lte(new bn_js_1.BN('7f', 16)))
            break;
        number = number.shrn(7).sub(new bn_js_1.BN(1, 10));
        len++;
    }
    tmp = tmp.reverse();
    return Buffer.from(tmp);
};
const readVarInt = (data, offset) => {
    let n = new bn_js_1.BN(0, 10);
    let pos = offset;
    while (true) {
        let chData = data.readUInt8(pos); // single char
        pos++;
        n = n.shln(7).or(new bn_js_1.BN(chData & 0x7f));
        if (chData & 0x80)
            n = n.add(new bn_js_1.BN(1, 10));
        else
            return { value: n, length: pos - offset };
    }
};
const encodingLength = (number) => {
    return writeVarInt(number).length;
};
function encode(number, buffer, offset) {
    if (!buffer)
        buffer = Buffer.alloc(encodingLength(number));
    if (!Buffer.isBuffer(buffer))
        throw new TypeError('buffer must be a Buffer instance');
    if (!offset)
        offset = 0;
    const varintBuf = writeVarInt(number);
    if (buffer.length < offset + varintBuf.length) {
        throw new Error('Cannot write slice out of bounds');
    }
    const bytes = varintBuf.copy(buffer, offset);
    return { buffer, bytes };
}
function decode(buffer, offset) {
    if (!Buffer.isBuffer(buffer))
        throw new TypeError('buffer must be a Buffer instance');
    if (!offset)
        offset = 0;
    const { value, length } = readVarInt(buffer, offset);
    return { decoded: value, bytes: length };
}
exports.default = {
    encode,
    decode,
    encodingLength
};
