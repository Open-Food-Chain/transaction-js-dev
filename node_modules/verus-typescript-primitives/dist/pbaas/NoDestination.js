"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDestination = void 0;
const Hash160_1 = require("../vdxf/classes/Hash160");
class NoDestination extends Hash160_1.Hash160SerEnt {
    constructor() {
        super(Buffer.alloc(0), 0, false);
    }
    fromBuffer(buffer, offset) {
        return offset;
    }
}
exports.NoDestination = NoDestination;
