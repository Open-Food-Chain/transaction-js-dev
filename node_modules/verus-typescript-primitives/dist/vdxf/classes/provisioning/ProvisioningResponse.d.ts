/// <reference types="node" />
import { VerusIDSignatureInterface } from "../../";
import { ProvisioningDecisionInterface } from "./ProvisioningDecision";
import { Response } from "../Response";
export interface ProvisioningResponseInterface {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignatureInterface;
    decision: ProvisioningDecisionInterface;
}
export declare class ProvisioningResponse extends Response {
    constructor(response?: ProvisioningResponseInterface);
    fromDataBuffer(buffer: Buffer, offset?: number): number;
}
