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
exports.insertIntoStatusTable = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const checkTableIfExist_1 = require("./checkTableIfExist");
const status_schema_1 = require("../../schemas/status-schema");
const bigqueryClient = new bigquery_1.BigQuery();
const insertIntoStatusTable = ({ datasetId, tableId, row, }) => __awaiter(void 0, void 0, void 0, function* () {
    const ifTableExist = yield (0, checkTableIfExist_1.checkTableIfExist)({
        datasetId,
        tableId,
    });
    if (ifTableExist[0]) {
        // table exist
        console.log(`「${tableId}」に挿入している。。。`);
        const rows = [row];
        console.log("Posting end job_id is " + row.jobId);
        return yield bigqueryClient
            // projectId
            .dataset(datasetId)
            .table(tableId)
            .insert(rows);
    }
    else {
        // table does not exist
        // create table in bigquery
        try {
            const bigqueryClient = new bigquery_1.BigQuery();
            yield bigqueryClient
                .dataset(datasetId)
                .createTable(tableId, status_schema_1.STATUS_TABLE_SCHEMA);
        }
        catch (error) {
            console.log(`「${tableId}」でテーブルを作成するうちにエラーがある => ${error}`);
        }
        console.log(`「${tableId}」に挿入している。。。`);
        const rows = [row];
        console.log("Posting end job_id is " + row.jobId);
        return yield bigqueryClient
            // projectId
            .dataset(datasetId)
            .table(tableId)
            .insert(rows);
    }
});
exports.insertIntoStatusTable = insertIntoStatusTable;
//# sourceMappingURL=insertIntoStatusTable.js.map