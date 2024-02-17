import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitive } from "./ApiPrimitive";
export declare class ApiResponse implements ApiCommunication {
    result: ApiPrimitive;
    constructor(result: any);
    toJson(): ApiPrimitive;
}
