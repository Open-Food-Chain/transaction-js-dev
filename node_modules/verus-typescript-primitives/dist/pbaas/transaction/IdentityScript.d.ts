import { SerializableEntity } from "../../utils/types/SerializableEntity";
import { Identity } from "../Identity";
import { OptCCParams } from "../OptCCParams";
import { SmartTransactionScript } from "./SmartTransactionScript";
export declare class IdentityScript extends SmartTransactionScript implements SerializableEntity {
    constructor(master?: OptCCParams, params?: OptCCParams);
    static fromIdentity(identity: Identity): IdentityScript;
    getIdentity(multimapKeylists?: Array<Array<string> | null>): Identity;
}
