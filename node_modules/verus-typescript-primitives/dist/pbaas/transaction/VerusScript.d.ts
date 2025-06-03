/// <reference types="node" />
import { ScriptChunk } from "../../utils/script";
import { SerializableEntity } from "../../utils/types/SerializableEntity";
export declare class VerusScript implements SerializableEntity {
    chunks: Array<ScriptChunk>;
    constructor(chunks?: Array<ScriptChunk>);
    getByteLength(): number;
    fromBuffer(buffer: Buffer, offset?: number, length?: number): number;
    private internalToBuffer;
    toBuffer(): Buffer;
}
