import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
declare type Utxo = {
    address: string;
    txid: string;
    outputIndex: number;
    script: string;
    currencyvalues?: {
        [key: string]: number;
    };
    currencynames?: {
        [key: string]: string;
    };
    satoshis: number;
    height: number;
    isspendable: number;
    blocktime: number;
};
export declare class FundRawTransactionRequest extends ApiRequest {
    txhex: string;
    utxos?: Array<Utxo>;
    changeaddr?: string;
    explicitfee?: number;
    constructor(chain: string, txhex: string, utxos?: Array<Utxo>, changeaddr?: string, explicitfee?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): FundRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}
export {};
