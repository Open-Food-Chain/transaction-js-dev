import { ApiCommunication } from "./ApiCommunication";
import { ApiPrimitiveJson, RequestParams } from "./ApiPrimitive";
export declare abstract class ApiRequest implements ApiCommunication {
    chain: string;
    cmd: string;
    abstract getParams(): RequestParams;
    abstract toJson(): ApiPrimitiveJson;
    constructor(chain: string, cmd: string);
    prepare(): [string, string, RequestParams];
}
