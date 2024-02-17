"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = require("bn.js");
// Hack to force BigNumber to get typeof class instead of BN namespace
const BNClass = new bn_js_1.BN(0);
