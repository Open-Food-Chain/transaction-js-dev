/// <reference types="node" />
import { ScriptChunk } from "../../utils/script";
import { SerializableEntity } from "../../utils/types/SerializableEntity";
import { OptCCParams } from "../OptCCParams";
import { VerusScript } from "./VerusScript";
export declare class SmartTransactionScript extends VerusScript implements SerializableEntity {
    protected master: OptCCParams;
    protected params: OptCCParams;
    constructor(master?: OptCCParams, params?: OptCCParams);
    static getChunks(master: OptCCParams, params: OptCCParams): Array<ScriptChunk>;
    private updateChunks;
    fromBuffer(buffer: Buffer, offset?: number, length?: number): number;
    toBuffer(): Buffer;
    getByteLength(): number;
    set masterOptCC(master: OptCCParams);
    set paramsOptCC(params: OptCCParams);
    get masterOptCC(): OptCCParams;
    get paramsOptCC(): OptCCParams;
}
