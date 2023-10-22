"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningResponse = void 0;
const __1 = require("../../");
const ProvisioningDecision_1 = require("./ProvisioningDecision");
const Response_1 = require("../Response");
class ProvisioningResponse extends Response_1.Response {
    constructor(response = {
        system_id: "",
        signing_id: "",
        decision: new ProvisioningDecision_1.ProvisioningDecision(),
    }) {
        super({
            system_id: response.system_id,
            signing_id: response.signing_id,
            signature: response.signature,
            decision: response.decision,
        }, __1.LOGIN_CONSENT_PROVISIONING_RESPONSE_VDXF_KEY.vdxfid);
        this.decision = new ProvisioningDecision_1.ProvisioningDecision(response.decision);
    }
    fromDataBuffer(buffer, offset) {
        let _offset = super.fromDataBuffer(buffer, offset);
        this.decision = new ProvisioningDecision_1.ProvisioningDecision();
        _offset = this.decision.fromBuffer(buffer, _offset);
        return _offset;
    }
}
exports.ProvisioningResponse = ProvisioningResponse;
