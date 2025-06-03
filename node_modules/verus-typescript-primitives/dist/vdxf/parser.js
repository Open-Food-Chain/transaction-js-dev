"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVdxfObjectString = void 0;
const base64url_1 = require("base64url");
const classes_1 = require("./classes");
const keys_1 = require("./keys");
const bufferutils_1 = require("../utils/bufferutils");
const vdxf_1 = require("../constants/vdxf");
const address_1 = require("../utils/address");
function parseVdxfObjectString(str) {
    const isDeeplinkUri = str.includes("x-callback-url");
    if (isDeeplinkUri) {
        const splitUri = str.split('x-callback-url/');
        const uriTail = splitUri[1];
        if (uriTail == null)
            throw new Error("Failed to decode deeplink uri");
        const splitUriTail = uriTail.split('/');
        const deeplinkType = splitUriTail[0];
        if (deeplinkType == null)
            throw new Error("Failed to parse deeplink type");
        if (deeplinkType === keys_1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid) {
            return classes_1.LoginConsentRequest.fromWalletDeeplinkUri(str);
        }
        else if (deeplinkType === keys_1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid) {
            return classes_1.VerusPayInvoice.fromWalletDeeplinkUri(str);
        }
        else
            throw new Error("Unrecognized vdxf object type " + deeplinkType);
    }
    else {
        const objBuf = base64url_1.default.toBuffer(str);
        const reader = new bufferutils_1.default.BufferReader(objBuf, 0);
        const vdxfKeyBuf = reader.readSlice(vdxf_1.HASH160_BYTE_LENGTH);
        const vdxfKey = (0, address_1.toBase58Check)(vdxfKeyBuf, vdxf_1.I_ADDR_VERSION);
        if (vdxfKey === keys_1.LOGIN_CONSENT_REQUEST_VDXF_KEY.vdxfid) {
            return classes_1.LoginConsentRequest.fromQrString(str);
        }
        else if (vdxfKey === keys_1.VERUSPAY_INVOICE_VDXF_KEY.vdxfid) {
            return classes_1.VerusPayInvoice.fromQrString(str);
        }
        else
            throw new Error("Unrecognized vdxf object type " + vdxfKey);
    }
}
exports.parseVdxfObjectString = parseVdxfObjectString;
