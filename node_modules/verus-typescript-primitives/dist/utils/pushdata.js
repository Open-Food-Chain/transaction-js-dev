"use strict";
// The MIT License (MIT)
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.encodingLength = void 0;
// Copyright (c) 2016 Daniel Cousens
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
const ops_1 = require("./ops");
function encodingLength(i) {
    return i < ops_1.OPS.OP_PUSHDATA1 ? 1
        : i <= 0xff ? 2
            : i <= 0xffff ? 3
                : 5;
}
exports.encodingLength = encodingLength;
function encode(buffer, number, offset) {
    var size = encodingLength(number);
    // ~6 bit
    if (size === 1) {
        buffer.writeUInt8(number, offset);
        // 8 bit
    }
    else if (size === 2) {
        buffer.writeUInt8(ops_1.OPS.OP_PUSHDATA1, offset);
        buffer.writeUInt8(number, offset + 1);
        // 16 bit
    }
    else if (size === 3) {
        buffer.writeUInt8(ops_1.OPS.OP_PUSHDATA2, offset);
        buffer.writeUInt16LE(number, offset + 1);
        // 32 bit
    }
    else {
        buffer.writeUInt8(ops_1.OPS.OP_PUSHDATA4, offset);
        buffer.writeUInt32LE(number, offset + 1);
    }
    return size;
}
exports.encode = encode;
function decode(buffer, offset) {
    var opcode = buffer.readUInt8(offset);
    var number, size;
    // ~6 bit
    if (opcode < ops_1.OPS.OP_PUSHDATA1) {
        number = opcode;
        size = 1;
        // 8 bit
    }
    else if (opcode === ops_1.OPS.OP_PUSHDATA1) {
        if (offset + 2 > buffer.length)
            return null;
        number = buffer.readUInt8(offset + 1);
        size = 2;
        // 16 bit
    }
    else if (opcode === ops_1.OPS.OP_PUSHDATA2) {
        if (offset + 3 > buffer.length)
            return null;
        number = buffer.readUInt16LE(offset + 1);
        size = 3;
        // 32 bit
    }
    else {
        if (offset + 5 > buffer.length)
            return null;
        if (opcode !== ops_1.OPS.OP_PUSHDATA4)
            throw new Error('Unexpected opcode');
        number = buffer.readUInt32LE(offset + 1);
        size = 5;
    }
    return {
        opcode: opcode,
        number: number,
        size: size
    };
}
exports.decode = decode;
