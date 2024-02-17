import { ApiResponse } from "../../ApiResponse";
export declare class FundRawTransactionResponse extends ApiResponse {
    result: {
        hex: string;
        changepos: number;
        fee: number;
    };
}
