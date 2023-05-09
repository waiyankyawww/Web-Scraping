"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_SCHEMA = void 0;
exports.JOB_SCHEMA = {
    sourceFormat: "NEWLINE_DELIMITED_JSON",
    schema: {
        fields: [
            { name: "redirectLink", type: "STRING" },
            { name: "jobId", type: "STRING" },
            { name: "companyIdStr", type: "STRING" },
            { name: "companyId", type: "INTEGER" },
            { name: "companyName", type: "STRING" },
            { name: "jobTitle", type: "STRING" },
            { name: "hiringStatus", type: "STRING" },
            { name: "jobCaptionTitle", type: "STRING" },
            { name: "jobCaptionTxt", type: "STRING" },
            {
                name: "jobImgs",
                type: "RECORD",
                mode: "REPEATED",
                fields: [{ name: "src", type: "STRING" }],
            },
            { name: "salary", type: "STRING" },
            { name: "workingHours", type: "STRING" },
            {
                name: "appealTags",
                type: "RECORD",
                mode: "REPEATED",
                fields: [
                    {
                        name: "tag",
                        type: "STRING",
                    },
                ],
            },
            { name: "occupation", type: "STRING" },
            { name: "qualification", type: "STRING" },
            { name: "workLocation", type: "STRING" },
            { name: "workingPeriod", type: "STRING" },
            { name: "holidays", type: "STRING" },
            { name: "shiftDetails", type: "STRING" },
            { name: "numberOfApplicants", type: "STRING" },
            { name: "transportationCosts", type: "STRING" },
            { name: "benefits", type: "STRING" },
            { name: "jobRemarks", type: "STRING" },
            {
                name: "nearestStations",
                type: "RECORD",
                mode: "REPEATED",
                fields: [
                    {
                        name: "stationName",
                        type: "STRING",
                    },
                ],
            },
            { name: "employeeComposition", type: "STRING" },
            {
                name: "workingAtmosphere",
                type: "RECORD",
                mode: "REPEATED",
                fields: [
                    {
                        name: "firstOption",
                        type: "STRING",
                    },
                    {
                        name: "secondOption",
                        type: "STRING",
                    },
                    {
                        name: "active",
                        type: "STRING",
                    },
                ],
            },
            { name: "workingStyles", type: "STRING" },
            { name: "applicationMethod", type: "STRING" },
            { name: "processAfterApplication", type: "STRING" },
            { name: "selectionProcess", type: "STRING" },
            { name: "jobAge", type: "STRING" },
            { name: "businessContent", type: "STRING" },
            { name: "companyAddress", type: "STRING" },
            { name: "homePage", type: "STRING" },
            { name: "contactInformation", type: "STRING" },
            { name: "remainingDays", type: "STRING" },
            { name: "crawledDateStr", type: "STRING" },
            { name: "crawledDate", type: "DATETIME" },
        ],
    },
    location: "asia-northeast1",
};
//# sourceMappingURL=job-schema.js.map