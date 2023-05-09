import * as dotenv from "dotenv";
dotenv.config();

import { checkTableIfExist } from "./lib/checkTableIfExist";
import { insertRow } from "./lib/insertIntoBigquery";
import { JOB_SCHEMA } from "../schemas/job-schema";
import { Page } from "puppeteer";
import { Job } from "./data-definition";
import { extractJob } from "./lib/extract-jobs";
import { insertIntoStatusTable } from "./lib/insertIntoStatusTable";

import { BigQuery } from "@google-cloud/bigquery";
import moment from "moment-timezone";

interface Args {
  page: Page;
  url: string;
  pageNo: string;
  yearMonthDay: string;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const main = async ({ page, url, pageNo, yearMonthDay }: Args) => {
  const datasetId = process.env.DATASET_ID;
  const statusTable = process.env.STATUS_TABLE
  const tableId = process.env.TABLE_ID
  const requiredEnvVariables = [datasetId, tableId];
  const jobTable = tableId + "_" + yearMonthDay;

  if (
    requiredEnvVariables.filter(function (value) {
      if (value === undefined) return value;
    }).length > 0
  ) {
    throw Error("必須の「環境変数」は提供されていません。");
  }

  const ifTableExist = await checkTableIfExist({ datasetId, tableId: jobTable });
  console.log(`テーブルがあるか？　→ ${ifTableExist[0]}`);

  if (!ifTableExist[0]) {
    // create table in bigquery
    try {
      const bigqueryClient = new BigQuery();
      const [table] = await bigqueryClient
        .dataset(datasetId)
        .createTable(jobTable, JOB_SCHEMA);
      console.log(`Table ${table.id} created.`);
    } catch (error) {
      console.log(
        "「Bigquery」でテーブルを作成するうちにエラーがある " + error
      );
    }
  }

  let job: Job;
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
  } else {
    console.log("Link is townwork link");
    companyIdStr = arr[1].split("/")[1];
    companyId = arr[1].split("/")[1].substring(4);
    jobId = arr[1].split("/")[2].includes("?")
      ? ""
      : arr[1].split("/")[2].substring(5);
    try {
      await page.goto(url);
      // call extract job
      job = await extractJob(page, url, pageNo);
    } catch (error) {
      console.log(
        `Page No -> ${pageNo}, URL -> ${url} => 詳細情報をとるときエラーがある。。。 ${error}`
      );
      // INSERTING INTO STATUS TABLE
      await insertIntoStatusTable({
        datasetId,
        tableId: statusTable + "_" + yearMonthDay,
        row: {
          jobId: "",
          companyId: "",
          pageNo: Number(pageNo),
          url,
          crawlStatus: "掲載を停止",
          createdAt: BigQuery.datetime(
            moment
              .tz(moment(new Date()), "Asia/Tokyo")
              .format("YYYY-MM-DDTHH:mm:ss")
          ),
        },
      });
    }
  }
  // insert row to BigQuery
  try {
    await insertRow({ datasetId, tableId: jobTable, job, pageNo });
    // INSERTING INTO STATUS TABLE
    await insertIntoStatusTable({
      datasetId,
      tableId: statusTable + "_" + yearMonthDay,
      row: {
        jobId,
        companyId,
        pageNo: Number(pageNo),
        url,
        crawlStatus: "成功",
        createdAt: BigQuery.datetime(
          moment
            .tz(moment(new Date()), "Asia/Tokyo")
            .format("YYYY-MM-DDTHH:mm:ss")
        ),
      },
    });
  } catch (error) {
    console.log("ジョブ情報の行を挿入するうちにエラーがある : " + error);
    // INSERTING INTO STATUS TABLE
    await insertIntoStatusTable({
      datasetId,
      tableId: statusTable + "_" + yearMonthDay,
      row: {
        jobId,
        companyId,
        pageNo: Number(pageNo),
        url,
        crawlStatus: "失敗",
        createdAt: BigQuery.datetime(
          moment
            .tz(moment(new Date()), "Asia/Tokyo")
            .format("YYYY-MM-DDTHH:mm:ss")
        ),
      },
    });
  }
};
