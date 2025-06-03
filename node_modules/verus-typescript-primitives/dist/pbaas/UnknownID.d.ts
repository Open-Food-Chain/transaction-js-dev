/// <reference types="node" />
import { SerializableEntity } from "../utils/types/SerializableEntity";
export declare class UnknownID implements SerializableEntity {
    bytes: Buffer;
    constructor(bytes?: Buffer);
    getByteLength(): number;
    fromBuffer(buffer: Buffer, offset?: number, length?: number): number;
    toBuffer(): Buffer;
}
