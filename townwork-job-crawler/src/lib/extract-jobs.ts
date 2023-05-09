import { Page } from "puppeteer";
import { selectWithExactClass, getDataFromTable } from "./extractFunctions";
import { NearestStationsRecord } from "../data-definition";
import { sleep } from "../index";
import { Job } from "../data-definition";
import moment from "moment-timezone";
import { BigQuery } from "@google-cloud/bigquery";

export const extractJob = async (
  page: Page,
  url: string,
  pageNo: string
): Promise<Job> => {
  const arr = url.split("detail");
  const companyIdStr = arr[1].split("/")[1];
  const companyId = Number(arr[1].split("/")[1].substring(4));
  const jobId = arr[1].split("/")[2].includes("?")
    ? ""
    : arr[1].split("/")[2].substring(5);

  const jobTitle = await selectWithExactClass({
    page,
    className: ".comparison-TM-headerText",
  });
  const hiringStatus = await selectWithExactClass({
    page,
    className: ".job-detail-arf-tag",
  });
  const { jobCaptionTitle, jobCaptionTxt } = await page.$eval(
    ".job-detail-txt-wrap",
    (el) => {
      return {
        jobCaptionTitle:
          (el.querySelector(".job-detail-caption-c") &&
            (
              el.querySelector(".job-detail-caption-c") as HTMLElement
            ).innerText.trim()) ||
          "",
        jobCaptionTxt:
          (el.querySelector(".job-detail-txt") &&
            (
              el.querySelector(".job-detail-txt") as HTMLElement
            ).innerText.trim()) ||
          "",
      };
    }
  );

  const jobImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".job-detail-img"), (el) => {
      return {
        src:
          "https://townwork.net" + el.querySelector("img").getAttribute("src"),
      };
    });
  });
  const salary = await page.evaluate(() => {
    return (
      Array.from(
        document.querySelectorAll(
          ".job-detail-tbl-main-wrap .job-ditail-tbl-inner dt"
        )
      ).find((el) => (el as HTMLElement).innerText.trim() === "給与")
        .nextElementSibling as HTMLElement
    ).innerText.trim();
  });
  const workingHours = await page.evaluate(() => {
    return (
      Array.from(
        document.querySelectorAll(
          ".job-detail-tbl-main-wrap .job-ditail-tbl-inner dt"
        )
      ).find((el) => (el as HTMLElement).innerText.trim() === "勤務時間")
        .nextElementSibling as HTMLElement
    ).innerText.trim();
  });
  const appealTags = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".job-detail-merit-inner li")
    ).map((el) => {
      return {
        tag: (el as HTMLElement).innerText.trim(),
      };
    });
  });

  // // GETTING DATA FROM RECRUITMENT TABLE

  const qualification = await page.evaluate(() => {
    const row = Array.from(
      document.querySelectorAll(".job-detail-box-tbl")
    ).find(
      (el) =>
        (el.previousElementSibling as HTMLElement).innerText.trim() ===
        "募集情報"
    );
    if (row) {
      const ele = Array.from(
        row.querySelectorAll(".job-ditail-tbl-inner dd")
      ).find(
        (el) =>
          (el.previousElementSibling as HTMLElement).innerText.trim() ===
          "対象となる方・資格"
      );
      if (ele) {
        return (
          Array.from(
            Array.from(document.querySelectorAll(".job-detail-box-tbl"))
              .find(
                (el) =>
                  (
                    el.previousElementSibling as HTMLElement
                  ).innerText.trim() === "募集情報"
              )
              .querySelectorAll(".job-ditail-tbl-inner dd")
          ).find(
            (el) =>
              (el.previousElementSibling as HTMLElement).innerText.trim() ===
              "対象となる方・資格"
          ) as HTMLElement
        ).innerText.trim();
      } else {
        return "";
      }
    } else {
      return "";
    }
  });

  const workLocation = await page.evaluate(() => {
    let value = "";
    const row = Array.from(
      document.querySelectorAll(".job-detail-box-tbl")
    ).find(
      (el) =>
        (el.previousElementSibling as HTMLElement).innerText.trim() ===
        "募集情報"
    );
    if (row) {
      const ele = Array.from(
        row.querySelectorAll(".job-ditail-tbl-inner dd")
      ).find(
        (el) =>
          (el.previousElementSibling as HTMLElement).innerText.trim() ===
          "勤務地"
      );
      if (ele) {
        value =
          ele.querySelector("p").childNodes[0].nodeValue.trim() !== "勤務地"
            ? ele.querySelector("p").childNodes[0].nodeValue.trim()
            : "";
      }
      return value;
    } else {
      return "";
    }
  });

  const occupation = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "職種",
  });

  const workingPeriod = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "勤務期間",
  });
  const holidays = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "休日・休暇",
  });
  const shiftDetails = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "シフト詳細",
  });
  const numberOfApplicants = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "採用予定人数",
  });

  const transportationCosts = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "交通費詳細",
  });
  const benefits = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "待遇・福利厚生",
  });
  const jobRemarks = await getDataFromTable({
    page,
    dtText: "募集情報",
    ddText: "その他",
  });

  let nearestStations: NearestStationsRecord[] = [];
  let contactInformation: string = "";
  if (await page.$(".jsc-modal-link")) {
    try {
      // clicking map modal
      await page.click(".jsc-modal-link");
      // waiting for station list & clicking station list
      await page.waitForSelector("#jsi-around-station");
      try {
        await page.click("#jsi-around-station");
        await sleep(1000);
        nearestStations = await page.evaluate(() => {
          const arr = Array.from(
            document.querySelectorAll("#jsi-navi-nrst li")
          );
          if (arr.length > 0) {
            return arr.map((el) => {
              return {
                stationName: (el as HTMLElement).innerText,
              };
            });
          }
        });
        // }
      } catch (error) {
        console.log("station error " + error);
      }

      await page.waitForSelector(".contents-tbl-inner");
      try {
        contactInformation = await page.evaluate(() => {
          const row = Array.from(
            document.querySelectorAll(".contents-tbl-inner")
          ).find(
            (el) => el.querySelector("dt").innerText.trim() === "問い合わせ先"
          );
          const ele = row.querySelector("dd");
          return ele ? ele.textContent.trim() : "";
        });
      } catch (error) {
        console.log("contact info error " + error);
      }
    } catch (error) {
      console.log("地図セレクタが見つかっていなかった。→ " + error);
    }
  }

  // GETTING DATA FROM WORKPLACE INFORMATION
  const employeeComposition = await getDataFromTable({
    page,
    dtText: "職場情報",
    ddText: "従業員構成",
  });

  // workingAtmoshpere
  const workingAtmosphere = await page.evaluate(() => {
    const row = Array.from(
      document.querySelectorAll(".job-detail-box-tbl")
    ).find(
      (el) =>
        (el.previousElementSibling as HTMLElement).innerText.trim() ===
        "職場情報"
    );
    if (row) {
      const ele = Array.from(
        row.querySelectorAll(".job-ditail-tbl-inner dd")
      ).find(
        (el) =>
          (el.previousElementSibling as HTMLElement).innerText.trim() ===
          "職場の雰囲気"
      );
      if (ele) {
        const ul = ele.querySelector(".job-detail-tbl-mood-list");

        return Array.from(ul.querySelectorAll("li")).map((li) => {
          return {
            firstOption: (
              li.querySelector(
                ".job-detail-tbl-mood-txt:not(.right)"
              ) as HTMLElement
            ).innerText.trim(),
            secondOption: (
              li.querySelector(".right") as HTMLElement
            ).innerText.trim(),
            active: (
              li.querySelector(
                ".job-detail-tbl-mood-dotted .is-active"
              ) as HTMLElement
            ).innerText.trim(),
          };
        });
      } else {
        return [];
      }
    } else {
      return [];
    }
  });

  const workingStyles = await getDataFromTable({
    page,
    dtText: "職場情報",
    ddText: "従業員の働き方・シフト・収入例",
  });

  // GETTING DATA FROM APPLICATION INFORMATION

  const applicationMethod = await getDataFromTable({
    page,
    dtText: "応募情報",
    ddText: "応募方法",
  });
  const processAfterApplication = await getDataFromTable({
    page,
    dtText: "応募情報",
    ddText: "応募後の流れ",
  });
  const selectionProcess = await getDataFromTable({
    page,
    dtText: "応募情報",
    ddText: "選考について",
  });
  const jobAge = await getDataFromTable({
    page,
    dtText: "応募情報",
    ddText: "掲載期間",
  });

  // get data from company information table
  const companyName = await getDataFromTable({
    page,
    dtText: "会社情報",
    ddText: "社名（店舗名）",
  });

  const businessContent = await getDataFromTable({
    page,
    dtText: "会社情報",
    ddText: "会社事業内容",
  });
  const companyAddress = await getDataFromTable({
    page,
    dtText: "会社情報",
    ddText: "会社住所",
  });
  const homePage = await getDataFromTable({
    page,
    dtText: "会社情報",
    ddText: "ホームページリンク",
  });

  const remainingDays = await page.evaluate(() => {
    const ele: HTMLElement = document.querySelector(
      ".job-detail-remaining-date-inner"
    );
    return ele ? ele.innerText.trim() : "";
  });

  return await {
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
    crawledDateStr: moment.tz(moment(new Date()), "Asia/Tokyo").format("MMMM Do YYYY, h:mm:ss a"),
    crawledDate: BigQuery.datetime(
      moment.tz(moment(new Date()), "Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss")
    ),
  };
};
