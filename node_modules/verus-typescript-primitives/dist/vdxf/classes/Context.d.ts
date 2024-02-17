/// <reference types="node" />
import { VDXFObject } from "..";
export declare class Context extends VDXFObject {
    kv: {
        [key: string]: string;
    };
    constructor(kv?: {
        [key: string]: string;
    }, vdxfkey?: string);
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toJson(): {
        kv: {
            [key: string]: string;
        };
        vdxfkey: string;
    };
}
