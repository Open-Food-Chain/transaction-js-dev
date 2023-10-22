"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcDecision = void 0;
const __1 = require("../../");
const OidcRequest_1 = require("./OidcRequest");
class OidcDecision extends __1.VDXFObject {
    constructor(decision) {
        super(__1.LOGIN_CONSENT_OIDC_DECISION_VDXF_KEY.vdxfid);
        this.subject = decision.subject;
        this.remember = decision.remember;
        this.remember_for = decision.remember_for;
        this.acr = decision.acr;
        this.context = decision.context;
        this.force_subject_identifier = decision.force_subject_identifier;
        this.error = decision.error;
        this.error_description = decision.error_description;
        this.error_hint = decision.error_hint;
        this.error_debug = decision.error_debug;
        this.status_code = decision.status_code;
        this.request = new OidcRequest_1.OidcRequest(decision.request);
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            subject: this.subject,
            remember: this.remember,
            remember_for: this.remember_for,
            acr: this.acr,
            context: this.context,
            force_subject_identifier: this.force_subject_identifier,
            error: this.error,
            error_description: this.error_description,
            error_hint: this.error_hint,
            error_debug: this.error_debug,
            status_code: this.status_code,
            request: this.request.toJson(),
        };
    }
}
exports.OidcDecision = OidcDecision;
