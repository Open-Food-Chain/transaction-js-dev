/// <reference types="node" />
export interface SerializableEntity {
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer, offset?: number): number;
    getByteLength(): number;
}
