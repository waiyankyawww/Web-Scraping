// Imports the Google Cloud Tasks library.
import { CloudTasksClient } from "@google-cloud/tasks";
import moment from "moment-timezone";

// Instantiates a client.
const client = new CloudTasksClient();

export const taskForJobCrawler = async (
  jobScraperUrl: string,
  url: string,
  pageNumber: number
) => {

  let todayDate = "";
  const currentHour = Number(moment.tz(moment(), "Asia/Tokyo").format("HH"));
  if (currentHour <= 23 && currentHour >= 18) {
    todayDate = moment.tz(moment().add(1, "days"), "Asia/Tokyo").format("YYYY-MM-DD");
  } else { 
    todayDate = moment.tz(moment(), "Asia/Tokyo").format("YYYY-MM-DD");
  }

  // Construct the fully qualified queue name.
  const inSeconds = 1;
  const parent = client.queuePath(
    process.env.PROJECT_ID,
    process.env.REGION,
    process.env.TOWNWORK_JOB_QUEUE
  );

  const task: any = {
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
  const [response] = await client.createTask(request);
  console.log(`「${response.name}　タスク」を作成した。`);
};
