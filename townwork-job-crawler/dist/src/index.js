"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.main = exports.sleep = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const checkTableIfExist_1 = require("./lib/checkTableIfExist");
const insertIntoBigquery_1 = require("./lib/insertIntoBigquery");
const job_schema_1 = require("../schemas/job-schema");
const extract_jobs_1 = require("./lib/extract-jobs");
const insertIntoStatusTable_1 = require("./lib/insertIntoStatusTable");
const bigquery_1 = require("@google-cloud/bigquery");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
const main = ({ page, url, pageNo, yearMonthDay }) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = process.env.DATASET_ID;
    const statusTable = process.env.STATUS_TABLE;
    const tableId = process.env.TABLE_ID;
    // let dateStr = "";
    // const currentHour = Number(moment.tz(moment(), "Asia/Tokyo").format("HH"));
    // if (currentHour <= 23 && currentHour >= 18) {
    //   dateStr =
    //     "_" + moment.tz(moment().add(1, "days"), "Asia/Tokyo").format("YYYYMMDD");
    // } else { 
    //   dateStr = "_" + moment.tz(moment(), "Asia/Tokyo").format("YYYYMMDD");
    // }
    const requiredEnvVariables = [datasetId, tableId];
    const jobTable = tableId + "_test_" + yearMonthDay;
    if (requiredEnvVariables.filter(function (value) {
        if (value === undefined)
            return value;
    }).length > 0) {
        throw Error("必須の「環境変数」は提供されていません。");
    }
    const ifTableExist = yield (0, checkTableIfExist_1.checkTableIfExist)({ datasetId, tableId: jobTable });
    console.log(`テーブルがあるか？　→ ${ifTableExist[0]}`);
    if (!ifTableExist[0]) {
        // create table in bigquery
        try {
            const bigqueryClient = new bigquery_1.BigQuery();
            const [table] = yield bigqueryClient
                .dataset(datasetId)
                .createTable(jobTable, job_schema_1.JOB_SCHEMA);
            console.log(`Table ${table.id} created.`);
        }
        catch (error) {
            console.log("「Bigquery」でテーブルを作成するうちにエラーがある " + error);
        }
    }
    let job;
    console.log("詳細情報をクロールしている。。。");
    console.log("URL is " + url);
    const arr = url.split("detail");
    let companyIdStr = "";
    let companyId = "";
    let jobId = "";
    if (new URL(url).hostname !== "townwork.net") {
        console.log("Link is not townwrok link " + url);
        job = {
            redirectLink: url,
            jobId: "",
            companyIdStr: null,
            companyId: null,
            companyName: "",
            jobTitle: "",
            hiringStatus: "",
            jobCaptionTitle: "",
            jobCaptionTxt: "",
            jobImgs: [],
            salary: "",
            workingHours: "",
            appealTags: [],
            occupation: "",
            qualification: "",
            workLocation: "",
            workingPeriod: "",
            holidays: "",
            shiftDetails: "",
            numberOfApplicants: "",
            transportationCosts: "",
            benefits: "",
            jobRemarks: "",
            nearestStations: [],
            employeeComposition: "",
            workingAtmosphere: [],
            workingStyles: "",
            applicationMethod: "",
            processAfterApplication: "",
            selectionProcess: "",
            jobAge: "",
            businessContent: "",
            companyAddress: "",
            contactInformation: "",
            homePage: "",
            remainingDays: "",
            crawledDateStr: "",
            crawledDate: null,
        };
    }
    else {
        console.log("Link is townwork link");
        companyIdStr = arr[1].split("/")[1];
        companyId = arr[1].split("/")[1].substring(4);
        jobId = arr[1].split("/")[2].includes("?")
            ? ""
            : arr[1].split("/")[2].substring(5);
        try {
            yield page.goto(url);
            // call extract job
            job = yield (0, extract_jobs_1.extractJob)(page, url, pageNo);
        }
        catch (error) {
            console.log(`Page No -> ${pageNo}, URL -> ${url} => 詳細情報をとるときエラーがある。。。 ${error}`);
            // INSERTING INTO STATUS TABLE
            yield (0, insertIntoStatusTable_1.insertIntoStatusTable)({
                datasetId,
                tableId: statusTable + "_test_" + yearMonthDay,
                row: {
                    jobId: "",
                    companyId: "",
                    pageNo: Number(pageNo),
                    url,
                    crawlStatus: "掲載を停止",
                    createdAt: bigquery_1.BigQuery.datetime(moment_timezone_1.default
                        .tz((0, moment_timezone_1.default)(new Date()), "Asia/Tokyo")
                        .format("YYYY-MM-DDTHH:mm:ss")),
                },
            });
        }
    }
    // insert row to BigQuery
    try {
        yield (0, insertIntoBigquery_1.insertRow)({ datasetId, tableId: jobTable, job, pageNo });
        // INSERTING INTO STATUS TABLE
        yield (0, insertIntoStatusTable_1.insertIntoStatusTable)({
            datasetId,
            tableId: statusTable + "_test_" + yearMonthDay,
            row: {
                jobId,
                companyId,
                pageNo: Number(pageNo),
                url,
                crawlStatus: "成功",
                createdAt: bigquery_1.BigQuery.datetime(moment_timezone_1.default
                    .tz((0, moment_timezone_1.default)(new Date()), "Asia/Tokyo")
                    .format("YYYY-MM-DDTHH:mm:ss")),
            },
        });
    }
    catch (error) {
        console.log("ジョブ情報の行を挿入するうちにエラーがある : " + error);
        // INSERTING INTO STATUS TABLE
        yield (0, insertIntoStatusTable_1.insertIntoStatusTable)({
            datasetId,
            tableId: statusTable + "_test_" + yearMonthDay,
            row: {
                jobId,
                companyId,
                pageNo: Number(pageNo),
                url,
                crawlStatus: "失敗",
                createdAt: bigquery_1.BigQuery.datetime(moment_timezone_1.default
                    .tz((0, moment_timezone_1.default)(new Date()), "Asia/Tokyo")
                    .format("YYYY-MM-DDTHH:mm:ss")),
            },
        });
    }
});
exports.main = main;
//# sourceMappingURL=index.js.map