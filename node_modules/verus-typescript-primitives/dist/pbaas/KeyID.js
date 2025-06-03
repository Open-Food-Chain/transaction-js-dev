"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyID = void 0;
const vdxf_1 = require("../constants/vdxf");
const Hash160_1 = require("../vdxf/classes/Hash160");
class KeyID extends Hash160_1.Hash160SerEnt {
    constructor(hash = Buffer.alloc(0)) {
        super(hash, vdxf_1.R_ADDR_VERSION, false);
    }
    fromBuffer(buffer, offset = 0) {
        const ret = super.fromBuffer(buffer, offset, false);
        this.version = vdxf_1.R_ADDR_VERSION;
        return ret;
    }
    static fromAddress(address) {
        return new KeyID(Hash160_1.Hash160SerEnt.fromAddress(address, false).hash);
    }
}
exports.KeyID = KeyID;
