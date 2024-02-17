"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequest = void 0;
class ApiRequest {
    constructor(chain, cmd) {
        this.chain = chain;
        this.cmd = cmd;
    }
    prepare() {
        return [this.chain, this.cmd, this.getParams()];
    }
}
exports.ApiRequest = ApiRequest;
