/// <reference types="node" />
import { Decision } from "../Decision";
import { Context } from "../Context";
import { ProvisioningRequest } from "./ProvisioningRequest";
import { ProvisioningResult } from "./ProvisioningResult";
export interface ProvisioningDecisionInterface {
    decision_id: string;
    created_at: number;
    salt?: string;
    result?: ProvisioningResult;
    request: ProvisioningRequest;
    context?: Context;
}
export declare class ProvisioningDecision extends Decision implements ProvisioningDecisionInterface {
    result?: ProvisioningResult;
    salt?: string;
    request: ProvisioningRequest;
    constructor(decision?: ProvisioningDecisionInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    toJson(): {
        vdxfkey: string;
        decision_id: string;
        created_at: number;
        salt: string;
        result: {};
        request: {
            vdxfkey: string;
            system_id: any;
            signing_address: string;
            signing_id: any;
            signature: import("../../").VerusIDSignatureJson;
            challenge: {
                vdxfkey: string;
                challenge_id: string;
                created_at: number;
                salt: string;
                name: string;
                system_id: string;
                parent: string;
                context: Context;
                requested_access: any;
                requested_access_audience: any;
                subject: any;
                provisioning_info: any;
                alt_auth_factors: any;
                session_id: any;
                attestations: any;
                skip: any;
                redirect_uris: any;
            };
        };
        context: {
            kv: {
                [key: string]: string;
            };
            vdxfkey: string;
        };
    };
    fromDataBuffer(buffer: Buffer, offset?: number): number;
}
