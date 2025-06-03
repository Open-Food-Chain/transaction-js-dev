/// <reference types="node" />
export declare type ScriptChunk = Buffer | number;
export declare function isOPInt(value: number): boolean;
export declare function isPushOnlyChunk(value: ScriptChunk): boolean;
export declare function isPushOnly(value: Array<ScriptChunk>): boolean;
export declare function asMinimalOP(buffer: Buffer): number | undefined;
export declare function compile(chunks: Buffer | Array<ScriptChunk>): Buffer;
export declare function decompile(buffer: Array<ScriptChunk> | Buffer): Array<ScriptChunk>;
export declare function toASM(chunks: Array<ScriptChunk> | Buffer): string;
export declare function fromASM(asm: string): Buffer;
export declare function isCanonicalPubKey(buffer: Buffer): boolean;
export declare function isDefinedHashType(hashType: number): boolean;
