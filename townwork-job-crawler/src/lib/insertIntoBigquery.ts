import { BigQuery } from "@google-cloud/bigquery";
import { Job } from "../data-definition";

const bigqueryClient = new BigQuery();

interface Args {
  datasetId: string;
  tableId: string;
  job: Job;
  pageNo: string;
}

export const insertRow = async ({ datasetId, tableId, job, pageNo }: Args) => {
  console.log(
    `「Bigquery」に挿入している。。。→ [datasetId　→ ${datasetId}], [tableId → ${tableId}]`
  );
  console.log(`Job ID → ${job.jobId} , Page No → ${pageNo} is inserted into jobs table`);
  const rows = [job];
  await bigqueryClient
    // projectId
    .dataset(datasetId)
    .table(tableId)
    .insert(rows);
};
