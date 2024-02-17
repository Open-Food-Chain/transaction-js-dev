"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(result) {
        this.result = result;
    }
    toJson() {
        return this.result;
    }
}
exports.ApiResponse = ApiResponse;
