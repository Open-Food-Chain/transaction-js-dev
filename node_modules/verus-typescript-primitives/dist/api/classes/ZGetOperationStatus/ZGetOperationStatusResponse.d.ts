import { ApiResponse } from "../../ApiResponse";
export declare type z_operation = {
    id: string;
    status: string;
    method: string;
    creation_time: number;
    result?: {
        [key: string]: any;
    };
    error?: {
        code: number;
        message: string;
    };
    execution_secs?: number;
    params: Array<{
        [key: string]: any;
    }>;
};
export declare class ZGetOperationStatusResponse extends ApiResponse {
    result: Array<z_operation>;
}
