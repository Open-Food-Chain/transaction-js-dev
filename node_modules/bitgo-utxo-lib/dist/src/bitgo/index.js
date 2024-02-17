"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.parseSignatureScript = exports.verifySignature = exports.getDefaultSigHash = exports.outputScripts = exports.keyutil = void 0;
exports.keyutil = require("./keyutil");
exports.outputScripts = require("./outputScripts");
var signature_1 = require("./signature");
__createBinding(exports, signature_1, "getDefaultSigHash");
__createBinding(exports, signature_1, "verifySignature");
__createBinding(exports, signature_1, "parseSignatureScript");
__exportStar(require("./transaction"), exports);
