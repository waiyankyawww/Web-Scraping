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
exports.taskForJobCrawler = void 0;
// Imports the Google Cloud Tasks library.
const tasks_1 = require("@google-cloud/tasks");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Instantiates a client.
const client = new tasks_1.CloudTasksClient();
const taskForJobCrawler = (jobScraperUrl, url, pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let todayDate = "";
    const currentHour = Number(moment_timezone_1.default.tz((0, moment_timezone_1.default)(), "Asia/Tokyo").format("HH"));
    if (currentHour <= 23 && currentHour >= 18) {
        todayDate = moment_timezone_1.default.tz((0, moment_timezone_1.default)().add(1, "days"), "Asia/Tokyo").format("YYYYMMDD");
    }
    else {
        todayDate = moment_timezone_1.default.tz((0, moment_timezone_1.default)(), "Asia/Tokyo").format("YYYYMMDD");
    }
    // Construct the fully qualified queue name.
    const inSeconds = 1;
    const parent = client.queuePath(process.env.PROJECT_ID, process.env.REGION, process.env.TOWNWORK_JOB_QUEUE);
    const task = {
        httpRequest: {
            httpMethod: "GET",
            url: `${jobScraperUrl}?url=${url}&pageNo=${pageNumber}&date=${todayDate}`,
            oidcToken: {
                serviceAccountEmail: process.env.TASK_SERVICE_ACC,
            },
        },
        scheduleTime: {
            seconds: inSeconds,
        },
    };
    if (inSeconds) {
        // The time when the task is scheduled to be attempted.
        task.scheduleTime = {
            seconds: inSeconds + Date.now() / 1000,
        };
    }
    // Send create task request.
    console.log(`「${url}」送信タスクが実行されている。。。`);
    const request = { parent, task };
    const [response] = yield client.createTask(request);
    console.log(`「${response.name}　タスク」を作成した。`);
});
exports.taskForJobCrawler = taskForJobCrawler;
//# sourceMappingURL=cloud-task-for-jobs.js.map