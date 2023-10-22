/// <reference types="node" />
import { VDXFObject } from "../../";
export declare class SignedSessionObjectData extends VDXFObject {
    session_id: string;
    timestamp_micro: number;
    body: string;
    constructor(data?: {
        session_id?: string;
        timestamp_micro?: number;
        body?: string;
    });
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        session_id: string;
        timestamp_micro: number;
        body: string;
    };
}
