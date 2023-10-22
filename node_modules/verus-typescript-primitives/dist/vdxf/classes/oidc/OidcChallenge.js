"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcChallenge = void 0;
const OidcClient_1 = require("./OidcClient");
const __1 = require("../..");
class OidcChallenge extends __1.VDXFObject {
    constructor(challenge) {
        super(__1.LOGIN_CONSENT_OIDC_CHALLENGE_VDXF_KEY.vdxfid);
        this.uuid = "";
        this.uuid = challenge.uuid;
        this.requested_scope = challenge.requested_scope;
        this.requested_access_token_audience = challenge.requested_access_token_audience;
        this.skip = challenge.skip;
        this.subject = challenge.subject;
        this.oidc_context = challenge.oidc_context;
        this.request_url = challenge.request_url;
        this.login_challenge = challenge.login_challenge;
        this.login_session_id = challenge.login_session_id;
        this.acr = challenge.acr;
        this.session_id = challenge.session_id;
        this.client = new OidcClient_1.OidcClient(challenge.client);
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            uuid: this.uuid,
            client: this.client.toJson(),
            requested_scope: this.requested_scope,
            requested_access_token_audience: this.requested_access_token_audience,
            skip: this.skip,
            subject: this.subject,
            oidc_context: this.oidc_context,
            request_url: this.request_url,
            login_challenge: this.login_challenge,
            login_session_id: this.login_session_id,
            acr: this.acr,
            session_id: this.session_id,
        };
    }
}
exports.OidcChallenge = OidcChallenge;
