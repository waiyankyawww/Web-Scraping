"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTAL_COUNT_TABLE_SCHEMA = void 0;
exports.TOTAL_COUNT_TABLE_SCHEMA = {
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
//# sourceMappingURL=total-schema.js.map