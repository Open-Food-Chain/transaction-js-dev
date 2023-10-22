import { ApiResponse } from "../../ApiResponse";
export declare class SignMessageResponse extends ApiResponse {
    result: {
        hash: string;
        signature: string;
    };
}
