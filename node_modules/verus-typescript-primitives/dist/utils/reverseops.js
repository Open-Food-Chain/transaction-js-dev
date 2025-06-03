"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ops_1 = require("./ops");
const map = {};
for (var op in ops_1.OPS) {
    var code = ops_1.OPS[op];
    map[code] = op;
}
exports.default = map;
