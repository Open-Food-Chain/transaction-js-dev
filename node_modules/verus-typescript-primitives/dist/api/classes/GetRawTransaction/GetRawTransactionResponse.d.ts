import { RawTransaction } from "../../../transaction/RawTransaction";
import { ApiResponse } from "../../ApiResponse";
export declare class GetRawTransactionResponse extends ApiResponse {
    result: string | RawTransaction;
}
