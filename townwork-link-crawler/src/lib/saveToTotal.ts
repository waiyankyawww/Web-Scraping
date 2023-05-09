import { BigQuery, BigQueryDate } from "@google-cloud/bigquery";
import { checkTableIfExist } from "./checkTableIfExist";
import { TOTAL_COUNT_TABLE_SCHEMA } from "../../schemas/total-schema";
const bigqueryClient = new BigQuery();

interface Row {
  id: string;
  count: number;
  crawlerName: string;
  totalPages: number;
  jobsPerPage: number;
  insertedDate: BigQueryDate;
}

interface Args {
  datasetId: string;
  tableId: string;
  row: Row;
}

export const saveToTotal = async ({ datasetId, tableId, row }: Args) => {
  console.log("saving to total");
  const ifTableExist = await checkTableIfExist({ datasetId, tableId });
  console.log(`テーブルがあるか？　→ ${ifTableExist[0]}`);

  if (!ifTableExist[0]) {
    // create table in bigquery
    try {
      const bigqueryClient = new BigQuery();
      const [table] = await bigqueryClient
        .dataset(datasetId)
        .createTable(tableId, TOTAL_COUNT_TABLE_SCHEMA);
      console.log(`Table ${table.id} created.`);
    } catch (error) {
      console.log(
        "「Bigquery」で「total」テーブルを作成するうちにエラーがある " + error
      );
    }
  }

  console.log(
    `「Bigquery」に挿入している。。。→ [datasetId　→ ${datasetId}], [tableId → ${tableId}]`
  );
  const rows = [row];
  await bigqueryClient
    // projectId
    .dataset(datasetId)
    .table(tableId)
    .insert(rows);
};
