/// <reference types="node" />
import { SerializableEntity } from '../utils/types/SerializableEntity';
import { Hash160SerEnt } from '../vdxf/classes/Hash160';
export declare class IdentityID extends Hash160SerEnt implements SerializableEntity {
    constructor(hash?: Buffer);
    fromBuffer(buffer: Buffer, offset?: number): number;
    static fromAddress(address: string, varlength?: boolean): Hash160SerEnt;
}
