import { VDXFObject } from "../../";
export interface RedirectUri {
    type: string;
    uri: string;
}
export interface OidcClientInterface {
    client_id: string;
    name?: string;
    redirect_uris?: Array<RedirectUri>;
    grant_types?: Array<string>;
    response_types?: Array<string>;
    scope?: string;
    audience?: Array<string> | null;
    owner?: string;
    policy_uri?: string;
    allowed_cors_origins?: Array<string> | null;
    tos_uri?: string;
    client_uri?: string;
    logo_uri?: string;
    contacts?: Array<string> | null;
    client_secret_expires_at?: number;
    subject_type?: string;
    token_endpoint_auth_method?: string;
    userinfo_signed_response_alg?: string;
    created_at: string;
    updated_at?: string;
}
export declare class OidcClient extends VDXFObject {
    client_id: string;
    name?: string;
    redirect_uris?: Array<RedirectUri>;
    grant_types?: Array<string>;
    response_types?: Array<string>;
    scope?: string;
    audience?: Array<string> | null;
    owner?: string;
    policy_uri?: string;
    allowed_cors_origins?: Array<string> | null;
    tos_uri?: string;
    client_uri?: string;
    logo_uri?: string;
    contacts?: Array<string> | null;
    client_secret_expires_at?: number;
    subject_type?: string;
    token_endpoint_auth_method?: string;
    userinfo_signed_response_alg?: string;
    created_at: string;
    updated_at?: string;
    constructor(client: OidcClientInterface);
    toJson(): {
        vdxfkey: string;
        client_id: string;
        name: string;
        redirect_uris: RedirectUri[];
        grant_types: string[];
        response_types: string[];
        scope: string;
        audience: string[];
        owner: string;
        policy_uri: string;
        allowed_cors_origins: string[];
        tos_uri: string;
        client_uri: string;
        logo_uri: string;
        contacts: string[];
        client_secret_expires_at: number;
        subject_type: string;
        token_endpoint_auth_method: string;
        userinfo_signed_response_alg: string;
        created_at: string;
        updated_at: string;
    };
}
