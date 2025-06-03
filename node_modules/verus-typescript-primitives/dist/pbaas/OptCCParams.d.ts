/// <reference types="node" />
import { TxDestination } from './TxDestination';
import { SerializableEntity } from '../utils/types/SerializableEntity';
import { BigNumber } from '../utils/types/BigNumber';
export declare type VData = Array<Buffer>;
export declare class OptCCParams implements SerializableEntity {
    version: BigNumber;
    eval_code: BigNumber;
    m: BigNumber;
    n: BigNumber;
    destinations: Array<TxDestination>;
    vdata: VData;
    constructor(data?: {
        version?: BigNumber;
        eval_code?: BigNumber;
        m?: BigNumber;
        n?: BigNumber;
        destinations?: Array<TxDestination>;
        vdata?: VData;
    });
    getParamObject(): null | Buffer;
    isValid(): boolean;
    static fromChunk(chunk: Buffer): OptCCParams;
    toChunk(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    internalGetByteLength(asChunk: boolean): number;
    getByteLength(): number;
    private internalToBuffer;
    toBuffer(): Buffer;
}
