/// <reference types="node" />
import { Challenge } from "../Challenge";
import { Context } from "../Context";
export interface ProvisioningChallengeInterface {
    challenge_id: string;
    created_at: number;
    salt?: string;
    name?: string;
    system_id?: string;
    parent?: string;
    context?: Context;
}
export declare class ProvisioningChallenge extends Challenge {
    name?: string;
    system_id?: string;
    parent?: string;
    constructor(challenge?: ProvisioningChallengeInterface);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
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
}
