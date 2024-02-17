"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCurrenciesRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class ListCurrenciesRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, query, startblock, endblock) {
        super(chain, cmds_1.LIST_CURRENCIES);
        this.query = query;
        this.startblock = startblock;
        this.endblock = endblock;
    }
    getParams() {
        if (this.query == null && this.startblock == null && this.endblock == null)
            return [];
        const params = [
            this.query == null ? {} : this.query,
            this.startblock == null ? 0 : this.startblock,
            this.endblock
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new ListCurrenciesRequest(object.chain, object.query, object.startblock, object.endblock);
    }
    toJson() {
        return {
            chain: this.chain,
            query: this.query,
            startblock: this.startblock,
            endblock: this.endblock
        };
    }
}
exports.ListCurrenciesRequest = ListCurrenciesRequest;
