// Imports the Google Cloud Tasks library.
import { CloudTasksClient } from "@google-cloud/tasks";

// Instantiates a client.
const client = new CloudTasksClient();

interface Args {
  linkScraperUrl: string;
  pageNumber: number;
}

export const taskForPage = async ({ linkScraperUrl, pageNumber }: Args) => {
  // const serviceAccountEmail = "intern_aikenyanlynnoo@haj.co.jp";
  // Construct the fully qualified queue name.

  const inSeconds = 1;
  const parent = client.queuePath(
    process.env.PROJECT_ID,
    process.env.REGION,
    process.env.TOWNWORK_LINK_QUEUE
  );

  const task: any = {
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
  console.log(
    `ページ番号：「${pageNumber}」を送信タスクが実行されている。。。`
  );
  // console.log(task);
  const request = { parent, task };
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);
};
