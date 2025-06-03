/// <reference types="bn.js" />
/// <reference types="node" />
import { VDXFObject, VerusIDSignature, VerusIDSignatureInterface, VerusIDSignatureJson } from "../../";
import { VerusPayInvoiceDetails, VerusPayInvoiceDetailsJson } from "./VerusPayInvoiceDetails";
import { BigNumber } from "../../../utils/types/BigNumber";
export declare const VERUSPAY_VERSION_CURRENT: import("bn.js");
export declare const VERUSPAY_VERSION_FIRSTVALID: import("bn.js");
export declare const VERUSPAY_VERSION_LASTVALID: import("bn.js");
export declare const VERUSPAY_VERSION_SIGNED: import("bn.js");
export declare const VERUSPAY_VERSION_MASK: import("bn.js");
export interface VerusPayInvoiceInterface {
    details: VerusPayInvoiceDetails;
    system_id?: string;
    signing_id?: string;
    signature?: VerusIDSignatureInterface;
    version?: BigNumber;
}
export declare type VerusPayInvoiceJson = {
    vdxfkey: string;
    details: VerusPayInvoiceDetailsJson;
    system_id?: string;
    signing_id?: string;
    signature?: VerusIDSignatureJson;
    version: string;
};
export declare class VerusPayInvoice extends VDXFObject {
    system_id: string;
    signing_id: string;
    signature?: VerusIDSignature;
    details: VerusPayInvoiceDetails;
    constructor(request?: VerusPayInvoiceInterface);
    getVersionNoFlags(): BigNumber;
    isValidVersion(): boolean;
    isSigned(): boolean;
    setSigned(): void;
    getDetailsHash(signedBlockheight: number, signatureVersion?: number): Buffer;
    protected _dataByteLength(signer?: string): number;
    protected _toDataBuffer(signer?: string): Buffer;
    dataByteLength(): number;
    toDataBuffer(): Buffer;
    protected _fromDataBuffer(buffer: Buffer, offset?: number): number;
    fromDataBuffer(buffer: Buffer, offset?: number): number;
    toWalletDeeplinkUri(): string;
    static fromWalletDeeplinkUri(uri: string): VerusPayInvoice;
    toQrString(): string;
    static fromQrString(qrstring: string): VerusPayInvoice;
    static fromJson(data: VerusPayInvoiceJson): VerusPayInvoice;
    toJson(): VerusPayInvoiceJson;
}
