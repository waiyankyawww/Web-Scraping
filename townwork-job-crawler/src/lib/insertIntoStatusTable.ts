import { BigQuery } from "@google-cloud/bigquery";
import { Status } from "../data-definition";
import { checkTableIfExist } from "./checkTableIfExist";
import { STATUS_TABLE_SCHEMA } from "../../schemas/status-schema";

const bigqueryClient = new BigQuery();

interface Args {
  datasetId: string;
  tableId: string;
  row: Status;
}

export const insertIntoStatusTable = async ({
  datasetId,
  tableId,
  row,
}: Args) => {
  const ifTableExist = await checkTableIfExist({
    datasetId,
    tableId,
  });

  if (ifTableExist[0]) {
    // table exist

    console.log(`「${tableId}」に挿入している。。。`);
    const rows = [row];
    console.log("inserted job_id into status is " + row.jobId);
    return await bigqueryClient
      // projectId
      .dataset(datasetId)
      .table(tableId)
      .insert(rows);
  } else {
    // table does not exist

    // create table in bigquery
    try {
      const bigqueryClient = new BigQuery();
      await bigqueryClient
        .dataset(datasetId)
        .createTable(tableId, STATUS_TABLE_SCHEMA);
    } catch (error) {
      console.log(
        `「${tableId}」でテーブルを作成するうちにエラーがある => ${error}`
      );
    }

    console.log(`「${tableId}」に挿入している。。。`);
    const rows = [row];
    console.log("Posting end job_id is " + row.jobId);
    return await bigqueryClient
      // projectId
      .dataset(datasetId)
      .table(tableId)
      .insert(rows);
  }
};