import { BigQuery } from "@google-cloud/bigquery";

const bigqueryClient = new BigQuery();

interface Args {
  datasetId: string;
  tableId: string;
}

export const checkTableIfExist = async ({
  datasetId,
  tableId,
}: Args): Promise<boolean[]> => {
  console.log("トータルテーブルがあるかチェックしている。。。");
  return await bigqueryClient.dataset(datasetId).table(tableId).exists();
};
