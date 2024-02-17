"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcClient = void 0;
const __1 = require("../../");
class OidcClient extends __1.VDXFObject {
    constructor(client) {
        super(__1.LOGIN_CONSENT_OIDC_CLIENT_VDXF_KEY.vdxfid);
        this.client_id = client.client_id;
        this.name = client.name;
        this.redirect_uris = client.redirect_uris;
        this.grant_types = client.grant_types;
        this.response_types = client.response_types;
        this.scope = client.scope;
        this.audience = client.audience;
        this.owner = client.owner;
        this.policy_uri = client.policy_uri;
        this.allowed_cors_origins = client.allowed_cors_origins;
        this.tos_uri = client.tos_uri;
        this.client_uri = client.client_uri;
        this.logo_uri = client.logo_uri;
        this.contacts = client.contacts;
        this.client_secret_expires_at = client.client_secret_expires_at;
        this.subject_type = client.subject_type;
        this.token_endpoint_auth_method = client.token_endpoint_auth_method;
        this.userinfo_signed_response_alg = client.userinfo_signed_response_alg;
        this.created_at = client.created_at;
        this.updated_at = client.updated_at;
    }
    toJson() {
        return {
            vdxfkey: this.vdxfkey,
            client_id: this.client_id,
            name: this.name,
            redirect_uris: this.redirect_uris,
            grant_types: this.grant_types,
            response_types: this.response_types,
            scope: this.scope,
            audience: this.audience,
            owner: this.owner,
            policy_uri: this.policy_uri,
            allowed_cors_origins: this.allowed_cors_origins,
            tos_uri: this.tos_uri,
            client_uri: this.client_uri,
            logo_uri: this.logo_uri,
            contacts: this.contacts,
            client_secret_expires_at: this.client_secret_expires_at,
            subject_type: this.subject_type,
            token_endpoint_auth_method: this.token_endpoint_auth_method,
            userinfo_signed_response_alg: this.userinfo_signed_response_alg,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }
}
exports.OidcClient = OidcClient;
