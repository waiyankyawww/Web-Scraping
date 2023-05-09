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
exports.checkTableIfExist = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const bigqueryClient = new bigquery_1.BigQuery();
const checkTableIfExist = ({ datasetId, tableId, }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("テーブルがあるかチェックしている。。。");
    return yield bigqueryClient.dataset(datasetId).table(tableId).exists();
});
exports.checkTableIfExist = checkTableIfExist;
//# sourceMappingURL=checkTableIfExist.js.map