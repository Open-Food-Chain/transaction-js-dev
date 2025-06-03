/// <reference types="node" />
export declare const fromBech32: (address: string) => {
    version: number;
    prefix: string;
    data: Buffer;
};
export declare const toBech32: (prefix: string, data: Buffer) => string;
export declare const convertBits: (data: Buffer, from: number, to: number, strictMode: boolean) => Buffer;
export declare const decodeSaplingAddress: (address: string) => {
    d: Buffer;
    pk_d: Buffer;
};
export declare const encodeSaplingAddress: (data: {
    d: Buffer;
    pk_d: Buffer;
}) => string;
