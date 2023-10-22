"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash160 = exports.hash = void 0;
const createHash = require("create-hash");
const hash = (...params) => {
    const _hash = createHash("sha256");
    params.forEach((value) => {
        _hash.update(value);
    });
    return createHash("sha256").update(_hash.digest()).digest();
};
exports.hash = hash;
const hash160 = (data) => {
    const sha256 = createHash("sha256");
    const ripemd160 = createHash("ripemd160");
    return ripemd160.update(sha256.update(data).digest()).digest();
};
exports.hash160 = hash160;
