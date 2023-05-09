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
exports.taskForPage = void 0;
// Imports the Google Cloud Tasks library.
const tasks_1 = require("@google-cloud/tasks");
// Instantiates a client.
const client = new tasks_1.CloudTasksClient();
const taskForPage = ({ linkScraperUrl, pageNumber }) => __awaiter(void 0, void 0, void 0, function* () {
    // const serviceAccountEmail = "intern_aikenyanlynnoo@haj.co.jp";
    // Construct the fully qualified queue name.
    const inSeconds = 1;
    const parent = client.queuePath(process.env.PROJECT_ID, process.env.REGION, process.env.TOWNWORK_LINK_QUEUE);
    const task = {
        httpRequest: {
            httpMethod: "GET",
            url: `${linkScraperUrl}/extract-links?pageNumber=${pageNumber}`,
            body: "",
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
    console.log(`ページ番号：「${pageNumber}」を送信タスクが実行されている。。。`);
    // console.log(task);
    const request = { parent, task };
    const [response] = yield client.createTask(request);
    console.log(`Created task ${response.name}`);
});
exports.taskForPage = taskForPage;
//# sourceMappingURL=cloud-task-for-page.js.map