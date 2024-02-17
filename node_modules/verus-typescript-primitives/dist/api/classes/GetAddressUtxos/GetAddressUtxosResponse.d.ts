import { ApiResponse } from "../../ApiResponse";
export declare class GetAddressUtxosResponse extends ApiResponse {
    result: Array<{
        address: string;
        txid: string;
        outputIndex: number;
        script: string;
        currencyvalues: {
            [key: string]: number;
        };
        currencynames: {
            [key: string]: string;
        };
        satoshis: number;
        height: number;
        isspendable: number;
        blocktime: number;
    }>;
}
