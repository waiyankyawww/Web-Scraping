export const TOTAL_COUNT_TABLE_SCHEMA: any = {
    sourceFormat: "NEWLINE_DELIMITED_JSON",
    schema: {
      fields: [
        { name: "id", type: "STRING" },
        { name: "count", type: "INTEGER" },
        { name: "crawlerName", type: "STRING" },
        { name: "insertedDate", type: "DATE" },
        { name: "totalPages", type: "INTEGER" },
        { name: "jobsPerPage", type: "INTEGER" },
      ],
    },
    location: "asia-northeast1",
  };
