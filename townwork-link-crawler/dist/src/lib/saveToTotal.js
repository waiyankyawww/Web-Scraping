"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToTotal = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const checkTableIfExist_1 = require("./checkTableIfExist");
const total_schema_1 = require("../../schemas/total-schema");
const bigqueryClient = new bigquery_1.BigQuery();
const saveToTotal = ({ datasetId, tableId, row }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("saving to total");
    const ifTableExist = yield (0, checkTableIfExist_1.checkTableIfExist)({ datasetId, tableId });
    console.log(`テーブルがあるか？　→ ${ifTableExist[0]}`);
    if (!ifTableExist[0]) {
        // create table in bigquery
        try {
            const bigqueryClient = new bigquery_1.BigQuery();
            const [table] = yield bigqueryClient
                .dataset(datasetId)
                .createTable(tableId, total_schema_1.TOTAL_COUNT_TABLE_SCHEMA);
            console.log(`Table ${table.id} created.`);
        }
        catch (error) {
            console.log("「Bigquery」で「total」テーブルを作成するうちにエラーがある " + error);
        }
    }
    console.log(`「Bigquery」に挿入している。。。→ [datasetId　→ ${datasetId}], [tableId → ${tableId}]`);
    const rows = [row];
    yield bigqueryClient
        // projectId
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);
});
exports.saveToTotal = saveToTotal;
//# sourceMappingURL=saveToTotal.js.map