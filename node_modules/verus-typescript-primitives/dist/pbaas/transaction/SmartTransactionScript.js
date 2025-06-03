"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartTransactionScript = void 0;
const ops_1 = require("../../utils/ops");
const OptCCParams_1 = require("../OptCCParams");
const VerusScript_1 = require("./VerusScript");
class SmartTransactionScript extends VerusScript_1.VerusScript {
    constructor(master, params) {
        super(master == null || params == null ? [] : SmartTransactionScript.getChunks(master, params));
        this.master = master;
        this.params = params;
    }
    static getChunks(master, params) {
        return [
            master.toChunk(),
            ops_1.OPS.OP_CHECKCRYPTOCONDITION,
            params.toChunk(),
            ops_1.OPS.OP_DROP
        ];
    }
    updateChunks() {
        this.chunks = SmartTransactionScript.getChunks(this.master, this.params);
    }
    fromBuffer(buffer, offset, length) {
        const _offset = super.fromBuffer(buffer, offset, length);
        this.master = OptCCParams_1.OptCCParams.fromChunk(this.chunks[0]);
        this.params = OptCCParams_1.OptCCParams.fromChunk(this.chunks[2]);
        return _offset;
    }
    toBuffer() {
        this.updateChunks();
        return super.toBuffer();
    }
    getByteLength() {
        this.updateChunks();
        return super.getByteLength();
    }
    set masterOptCC(master) {
        this.master = master;
        this.updateChunks();
    }
    set paramsOptCC(params) {
        this.params = params;
        this.updateChunks();
    }
    get masterOptCC() {
        return this.master;
    }
    get paramsOptCC() {
        return this.params;
    }
}
exports.SmartTransactionScript = SmartTransactionScript;
