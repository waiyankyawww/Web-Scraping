"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_TABLE_SCHEMA = void 0;
exports.STATUS_TABLE_SCHEMA = {
    sourceFormat: "NEWLINE_DELIMITED_JSON",
    schema: {
        fields: [
            { name: "jobId", type: "STRING" },
            { name: "companyId", type: "STRING" },
            { name: "pageNo", type: "INTEGER" },
            { name: "url", type: "STRING" },
            { name: "crawlStatus", type: "STRING" },
            {
                name: "createdAt",
                type: "DATETIME",
            },
        ],
    },
    location: "asia-northeast1",
};
//# sourceMappingURL=status-schema.js.map