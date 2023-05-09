import { Page } from "puppeteer";
import { BigQuery } from "@google-cloud/bigquery";
import { getTotalCount } from "./lib/getTotalPageCount";
import { taskForPage } from "./lib/cloud-task-for-page";
import { saveToTotal } from "./lib/saveToTotal";
import { generateRandomStr } from "./lib/generateRandomStr";
import moment from "moment-timezone";

interface Args {
  linkScraperUrl: string;
  url: string;
  page: Page;
}

export const scrapeLink = async ({ linkScraperUrl, url, page }: Args) => {
  try {
    // extract all Job URLs first
    await page.setDefaultNavigationTimeout(60000);
    // console.log("全部の「ジョブリンク」と「ID」を集まっている。。。");
    // jobInfos = await getJobInfos(page, url);
    console.log(`Go to  ${url} ....`);
    // go to main search result page
    const { totalJobs, totalPages } = await getTotalCount(page, url);

    await saveToTotal({
      datasetId: process.env.DATASET_ID,
      tableId:
        process.env.TOTAL_COUNT_TABLE_ID +  
        "_" +
        moment.tz(moment().add(1, "days"), "Asia/Tokyo").format("YYYYMMDD"),
      row: {
        id: generateRandomStr(),
        count: totalJobs,
        crawlerName: "townwork",
        totalPages,
        jobsPerPage: 30,
        insertedDate: BigQuery.date(
          moment.tz(moment().add(1, "days"), "Asia/Tokyo").format("YYYY-MM-DD")
        ),
      },
    });

    let pendingTasks = [];
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      pendingTasks.push(taskForPage({ linkScraperUrl, pageNumber }));
      if (pendingTasks.length > 10) {
        await Promise.all(pendingTasks);
        pendingTasks = []
      }
    }
    await Promise.all(pendingTasks);
  } catch (err) {
    console.log("ブラウザインスタンスを解決できませんでした。 => ", err);
  }
};
