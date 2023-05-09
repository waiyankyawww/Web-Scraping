export const STATUS_TABLE_SCHEMA: any = {
    sourceFormat: "NEWLINE_DELIMITED_JSON",
    schema: {
      fields: [
        { name: "jobId", type: "STRING" },
        { name: "companyId", type: "STRING" },
        { name: "pageNo", type: "INTEGER" },
        { name: "url", type: "STRING" },
        { name: "crawlStatus", type : "STRING"},
        {
          name: "createdAt",
          type: "DATETIME",
        },
      ],
    },
    location: "asia-northeast1",
  };
