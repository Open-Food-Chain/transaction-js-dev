"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityID = void 0;
const vdxf_1 = require("../constants/vdxf");
const Hash160_1 = require("../vdxf/classes/Hash160");
class IdentityID extends Hash160_1.Hash160SerEnt {
    constructor(hash = Buffer.alloc(0)) {
        super(hash, vdxf_1.I_ADDR_VERSION, false);
    }
    fromBuffer(buffer, offset = 0) {
        const ret = super.fromBuffer(buffer, offset, false);
        this.version = vdxf_1.I_ADDR_VERSION;
        return ret;
    }
    static fromAddress(address, varlength) {
        return new IdentityID(Hash160_1.Hash160SerEnt.fromAddress(address, false).hash);
    }
}
exports.IdentityID = IdentityID;
