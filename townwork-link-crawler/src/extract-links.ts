import { Page } from "puppeteer";
import _ from "lodash";
import { taskForJobCrawler } from "./lib/cloud-task-for-jobs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Args {
  jobScraperUrl: string;
  url: string;
  page: Page;
  pageNumber: number;
}

export const  extractLinks = async ({
  jobScraperUrl,
  url,
  page,
  pageNumber,
}: Args) => {
  await page.goto(`${url}&page=${pageNumber}`);
  console.log("ページ番号 - " + pageNumber);
  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".job-lst-main-box-inner"),
      (a: HTMLAnchorElement) => {
        const jobUrl = a.href;
        return jobUrl;
      }
    )
  );

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
  const uniqueArr = _.uniqBy(mappedArr, "id");
  let pendingTasks = [];
  for (const obj of uniqueArr) {
    pendingTasks.push(taskForJobCrawler(jobScraperUrl, obj.url, pageNumber));
    if (pendingTasks.length > 10) {
      await Promise.all(pendingTasks);
      pendingTasks = []
    }
  }
  await Promise.all(pendingTasks);
};
