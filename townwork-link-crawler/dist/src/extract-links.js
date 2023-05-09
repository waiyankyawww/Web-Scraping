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
exports.extractLinks = void 0;
const lodash_1 = __importDefault(require("lodash"));
const cloud_task_for_jobs_1 = require("./lib/cloud-task-for-jobs");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const extractLinks = ({ jobScraperUrl, url, page, pageNumber, }) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto(`${url}&page=${pageNumber}`);
    console.log("ページ番号 - " + pageNumber);
    const urls = yield page.evaluate(() => Array.from(document.querySelectorAll(".job-lst-main-box-inner"), (a) => {
        const jobUrl = a.href;
        return jobUrl;
    }));
    const mappedArr = urls.map((url) => {
        const arr = url.split("detail");
        const jobId = arr[1].split("/")[2].includes("?")
            ? ""
            : arr[1].split("/")[2].substring(5);
        return {
            id: jobId,
            url,
        };
    });
    const uniqueArr = lodash_1.default.uniqBy(mappedArr, "id");
    let pendingTasks = [];
    for (const obj of uniqueArr) {
        pendingTasks.push((0, cloud_task_for_jobs_1.taskForJobCrawler)(jobScraperUrl, obj.url, pageNumber));
        if (pendingTasks.length > 10) {
            yield Promise.all(pendingTasks);
            pendingTasks = [];
        }
    }
    yield Promise.all(pendingTasks);
});
exports.extractLinks = extractLinks;
//# sourceMappingURL=extract-links.js.map