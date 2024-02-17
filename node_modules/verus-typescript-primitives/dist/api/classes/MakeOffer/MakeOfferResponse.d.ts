import { ApiResponse } from "../../ApiResponse";
export declare class MakeOfferResponse extends ApiResponse {
    result: {
        txid?: string;
        hex?: string;
    };
}
