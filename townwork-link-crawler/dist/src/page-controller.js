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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLink = void 0;
const bigquery_1 = require("@google-cloud/bigquery");
const getTotalPageCount_1 = require("./lib/getTotalPageCount");
const cloud_task_for_page_1 = require("./lib/cloud-task-for-page");
const saveToTotal_1 = require("./lib/saveToTotal");
const generateRandomStr_1 = require("./lib/generateRandomStr");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const scrapeLink = ({ linkScraperUrl, url, page }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // extract all Job URLs first
        yield page.setDefaultNavigationTimeout(60000);
        // console.log("全部の「ジョブリンク」と「ID」を集まっている。。。");
        // jobInfos = await getJobInfos(page, url);
        console.log(`Go to  ${url} ....`);
        // go to main search result page
        const { totalJobs, totalPages } = yield (0, getTotalPageCount_1.getTotalCount)(page, url);
        yield (0, saveToTotal_1.saveToTotal)({
            datasetId: process.env.DATASET_ID,
            tableId: process.env.TOTAL_COUNT_TABLE_ID +
                "_" +
                moment_timezone_1.default.tz((0, moment_timezone_1.default)().add(1, "days"), "Asia/Tokyo").format("YYYYMMDD"),
            row: {
                id: (0, generateRandomStr_1.generateRandomStr)(),
                count: totalJobs,
                crawlerName: "townwork",
                totalPages,
                jobsPerPage: 30,
                insertedDate: bigquery_1.BigQuery.date(moment_timezone_1.default.tz((0, moment_timezone_1.default)().add(1, "days"), "Asia/Tokyo").format("YYYY-MM-DD")),
            },
        });
        let pendingTasks = [];
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            pendingTasks.push((0, cloud_task_for_page_1.taskForPage)({ linkScraperUrl, pageNumber }));
            if (pendingTasks.length > 10) {
                yield Promise.all(pendingTasks);
                pendingTasks = [];
            }
        }
        yield Promise.all(pendingTasks);
    }
    catch (err) {
        console.log("ブラウザインスタンスを解決できませんでした。 => ", err);
    }
});
exports.scrapeLink = scrapeLink;
//# sourceMappingURL=page-controller.js.map