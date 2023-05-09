"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJob = void 0;
const extractFunctions_1 = require("./extractFunctions");
const index_1 = require("../index");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const bigquery_1 = require("@google-cloud/bigquery");
const extractJob = (page, url, pageNo) => __awaiter(void 0, void 0, void 0, function* () {
    const arr = url.split("detail");
    const companyIdStr = arr[1].split("/")[1];
    const companyId = Number(arr[1].split("/")[1].substring(4));
    const jobId = arr[1].split("/")[2].includes("?")
        ? ""
        : arr[1].split("/")[2].substring(5);
    const jobTitle = yield (0, extractFunctions_1.selectWithExactClass)({
        page,
        className: ".comparison-TM-headerText",
    });
    const hiringStatus = yield (0, extractFunctions_1.selectWithExactClass)({
        page,
        className: ".job-detail-arf-tag",
    });
    const { jobCaptionTitle, jobCaptionTxt } = yield page.$eval(".job-detail-txt-wrap", (el) => {
        return {
            jobCaptionTitle: (el.querySelector(".job-detail-caption-c") &&
                el.querySelector(".job-detail-caption-c").innerText.trim()) ||
                "",
            jobCaptionTxt: (el.querySelector(".job-detail-txt") &&
                el.querySelector(".job-detail-txt").innerText.trim()) ||
                "",
        };
    });
    const jobImgs = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll(".job-detail-img"), (el) => {
            return {
                src: "https://townwork.net" + el.querySelector("img").getAttribute("src"),
            };
        });
    });
    const salary = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll(".job-detail-tbl-main-wrap .job-ditail-tbl-inner dt")).find((el) => el.innerText.trim() === "給与")
            .nextElementSibling.innerText.trim();
    });
    const workingHours = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll(".job-detail-tbl-main-wrap .job-ditail-tbl-inner dt")).find((el) => el.innerText.trim() === "勤務時間")
            .nextElementSibling.innerText.trim();
    });
    const appealTags = yield page.evaluate(() => {
        return Array.from(document.querySelectorAll(".job-detail-merit-inner li")).map((el) => {
            return {
                tag: el.innerText.trim(),
            };
        });
    });
    // // GETTING DATA FROM RECRUITMENT TABLE
    const qualification = yield page.evaluate(() => {
        const row = Array.from(document.querySelectorAll(".job-detail-box-tbl")).find((el) => el.previousElementSibling.innerText.trim() ===
            "募集情報");
        if (row) {
            const ele = Array.from(row.querySelectorAll(".job-ditail-tbl-inner dd")).find((el) => el.previousElementSibling.innerText.trim() ===
                "対象となる方・資格");
            if (ele) {
                return Array.from(Array.from(document.querySelectorAll(".job-detail-box-tbl"))
                    .find((el) => el.previousElementSibling.innerText.trim() === "募集情報")
                    .querySelectorAll(".job-ditail-tbl-inner dd")).find((el) => el.previousElementSibling.innerText.trim() ===
                    "対象となる方・資格").innerText.trim();
            }
            else {
                return "";
            }
        }
        else {
            return "";
        }
    });
    const workLocation = yield page.evaluate(() => {
        let value = "";
        const row = Array.from(document.querySelectorAll(".job-detail-box-tbl")).find((el) => el.previousElementSibling.innerText.trim() ===
            "募集情報");
        if (row) {
            const ele = Array.from(row.querySelectorAll(".job-ditail-tbl-inner dd")).find((el) => el.previousElementSibling.innerText.trim() ===
                "勤務地");
            if (ele) {
                value =
                    ele.querySelector("p").childNodes[0].nodeValue.trim() !== "勤務地"
                        ? ele.querySelector("p").childNodes[0].nodeValue.trim()
                        : "";
            }
            return value;
        }
        else {
            return "";
        }
    });
    const occupation = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "職種",
    });
    const workingPeriod = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "勤務期間",
    });
    const holidays = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "休日・休暇",
    });
    const shiftDetails = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "シフト詳細",
    });
    const numberOfApplicants = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "採用予定人数",
    });
    const transportationCosts = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "交通費詳細",
    });
    const benefits = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "待遇・福利厚生",
    });
    const jobRemarks = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "募集情報",
        ddText: "その他",
    });
    let nearestStations = [];
    let contactInformation = "";
    if (yield page.$(".jsc-modal-link")) {
        try {
            // clicking map modal
            yield page.click(".jsc-modal-link");
            // waiting for station list & clicking station list
            yield page.waitForSelector("#jsi-around-station");
            try {
                yield page.click("#jsi-around-station");
                yield (0, index_1.sleep)(1000);
                nearestStations = yield page.evaluate(() => {
                    const arr = Array.from(document.querySelectorAll("#jsi-navi-nrst li"));
                    if (arr.length > 0) {
                        return arr.map((el) => {
                            return {
                                stationName: el.innerText,
                            };
                        });
                    }
                });
                // }
            }
            catch (error) {
                console.log("station error " + error);
            }
            yield page.waitForSelector(".contents-tbl-inner");
            try {
                contactInformation = yield page.evaluate(() => {
                    const row = Array.from(document.querySelectorAll(".contents-tbl-inner")).find((el) => el.querySelector("dt").innerText.trim() === "問い合わせ先");
                    const ele = row.querySelector("dd");
                    return ele ? ele.textContent.trim() : "";
                });
            }
            catch (error) {
                console.log("contact info error " + error);
            }
        }
        catch (error) {
            console.log("地図セレクタが見つかっていなかった。→ " + error);
        }
    }
    // GETTING DATA FROM WORKPLACE INFORMATION
    const employeeComposition = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "職場情報",
        ddText: "従業員構成",
    });
    // workingAtmoshpere
    const workingAtmosphere = yield page.evaluate(() => {
        const row = Array.from(document.querySelectorAll(".job-detail-box-tbl")).find((el) => el.previousElementSibling.innerText.trim() ===
            "職場情報");
        if (row) {
            const ele = Array.from(row.querySelectorAll(".job-ditail-tbl-inner dd")).find((el) => el.previousElementSibling.innerText.trim() ===
                "職場の雰囲気");
            if (ele) {
                const ul = ele.querySelector(".job-detail-tbl-mood-list");
                return Array.from(ul.querySelectorAll("li")).map((li) => {
                    return {
                        firstOption: li.querySelector(".job-detail-tbl-mood-txt:not(.right)").innerText.trim(),
                        secondOption: li.querySelector(".right").innerText.trim(),
                        active: li.querySelector(".job-detail-tbl-mood-dotted .is-active").innerText.trim(),
                    };
                });
            }
            else {
                return [];
            }
        }
        else {
            return [];
        }
    });
    const workingStyles = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "職場情報",
        ddText: "従業員の働き方・シフト・収入例",
    });
    // GETTING DATA FROM APPLICATION INFORMATION
    const applicationMethod = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "応募情報",
        ddText: "応募方法",
    });
    const processAfterApplication = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "応募情報",
        ddText: "応募後の流れ",
    });
    const selectionProcess = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "応募情報",
        ddText: "選考について",
    });
    const jobAge = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "応募情報",
        ddText: "掲載期間",
    });
    // get data from company information table
    const companyName = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "会社情報",
        ddText: "社名（店舗名）",
    });
    const businessContent = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "会社情報",
        ddText: "会社事業内容",
    });
    const companyAddress = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "会社情報",
        ddText: "会社住所",
    });
    const homePage = yield (0, extractFunctions_1.getDataFromTable)({
        page,
        dtText: "会社情報",
        ddText: "ホームページリンク",
    });
    const remainingDays = yield page.evaluate(() => {
        const ele = document.querySelector(".job-detail-remaining-date-inner");
        return ele ? ele.innerText.trim() : "";
    });
    return yield {
        redirectLink: "",
        jobId,
        companyIdStr,
        companyId,
        companyName,
        jobTitle,
        hiringStatus,
        jobCaptionTitle,
        jobCaptionTxt,
        jobImgs,
        salary,
        workingHours,
        appealTags,
        occupation,
        qualification,
        workLocation,
        workingPeriod,
        holidays,
        shiftDetails,
        numberOfApplicants,
        transportationCosts,
        benefits,
        jobRemarks,
        nearestStations,
        employeeComposition,
        workingAtmosphere,
        workingStyles,
        applicationMethod,
        processAfterApplication,
        selectionProcess,
        jobAge,
        businessContent,
        companyAddress,
        contactInformation,
        homePage,
        remainingDays,
        crawledDateStr: moment_timezone_1.default.tz((0, moment_timezone_1.default)(new Date()), "Asia/Tokyo").format("MMMM Do YYYY, h:mm:ss a"),
        crawledDate: bigquery_1.BigQuery.datetime(moment_timezone_1.default.tz((0, moment_timezone_1.default)(new Date()), "Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss")),
    };
});
exports.extractJob = extractJob;
//# sourceMappingURL=extract-jobs.js.map