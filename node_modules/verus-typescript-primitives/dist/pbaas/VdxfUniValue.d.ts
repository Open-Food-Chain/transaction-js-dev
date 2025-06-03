/// <reference types="bn.js" />
/// <reference types="node" />
import { BigNumber } from '../utils/types/BigNumber';
import { SerializableEntity } from '../utils/types/SerializableEntity';
export declare const VDXF_UNI_VALUE_VERSION_INVALID: import("bn.js");
export declare const VDXF_UNI_VALUE_VERSION_CURRENT: import("bn.js");
export declare type VdxfUniType = string | Buffer;
export declare type VdxfUniValueJson = {
    [key: string]: string;
};
export declare class VdxfUniValue implements SerializableEntity {
    values: Map<string, VdxfUniType>;
    version: BigNumber;
    constructor(data?: {
        values: Map<string, VdxfUniType>;
        version?: BigNumber;
    });
    getByteLength(): number;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number, keylist?: Array<string>): number;
    static fromJson(obj: VdxfUniValueJson): VdxfUniValue;
    toJson(): VdxfUniValueJson;
}
