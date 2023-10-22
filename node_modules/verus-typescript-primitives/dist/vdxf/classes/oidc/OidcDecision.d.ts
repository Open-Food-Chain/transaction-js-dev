import { VDXFObject } from "../../";
import { OidcRequest, OidcRequestInterface } from "./OidcRequest";
export interface OidcDecisionInterface {
    subject?: string;
    remember?: boolean;
    remember_for?: number;
    acr?: string;
    context?: {
        [key: string]: any;
    };
    force_subject_identifier?: string;
    error?: string;
    error_description?: string;
    error_hint?: string;
    error_debug?: string;
    status_code?: number;
    request: OidcRequestInterface;
}
export declare class OidcDecision extends VDXFObject {
    subject?: string;
    remember?: boolean;
    remember_for?: number;
    acr?: string;
    context?: {
        [key: string]: any;
    };
    force_subject_identifier?: string;
    error?: string;
    error_description?: string;
    error_hint?: string;
    error_debug?: string;
    status_code?: number;
    request: OidcRequest;
    constructor(decision: OidcDecisionInterface);
    toJson(): {
        vdxfkey: string;
        subject: string;
        remember: boolean;
        remember_for: number;
        acr: string;
        context: {
            [key: string]: any;
        };
        force_subject_identifier: string;
        error: string;
        error_description: string;
        error_hint: string;
        error_debug: string;
        status_code: number;
        request: any;
    };
}
