/// <reference types="node" />
import { SerializableEntity } from "../utils/types/SerializableEntity";
import { Hash160SerEnt } from "../vdxf/classes/Hash160";
export declare class NoDestination extends Hash160SerEnt implements SerializableEntity {
    constructor();
    fromBuffer(buffer: Buffer, offset?: number): number;
}
