"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHexString = void 0;
const isHexString = (s) => {
    try {
        const striBuf = Buffer.from(s, 'hex');
        striBuf.toString('hex');
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isHexString = isHexString;
