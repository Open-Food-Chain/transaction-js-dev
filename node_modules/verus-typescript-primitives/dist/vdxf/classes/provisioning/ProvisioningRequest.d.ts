/// <reference types="node" />
import { VerusIDSignatureInterface } from "../../";
import { Request } from "../Request";
import { ProvisioningChallenge, ProvisioningChallengeInterface } from "./ProvisioningChallenge";
export interface ProvisioningRequestInterface {
    signing_address?: string;
    signature?: VerusIDSignatureInterface;
    challenge: ProvisioningChallengeInterface;
}
export declare class ProvisioningRequest extends Request {
    signing_address?: string;
    challenge: ProvisioningChallenge;
    constructor(request?: ProvisioningRequestInterface);
    toJson(): {
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
            context: import("..").Context;
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
    getChallengeHash(): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): Request;
}
