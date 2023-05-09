import { Page } from "puppeteer";

interface TableExtractArgs {
  page: Page;
  dtText: string;
  ddText: string;
}

interface SelectWithClassArgs {
  page: Page;
  className: string;
}

export const selectWithExactClass = async ({
  page,
  className,
}: SelectWithClassArgs) => {
  return await page.evaluate(
    ({ className }: { className: string }) => {
      return document.querySelector(className)
        ? (document.querySelector(className) as HTMLElement).innerText.trim()
        : "";
    },
    {
      className,
    }
  );
};
export const getDataFromTable = async ({
  page,
  dtText,
  ddText,
}: TableExtractArgs) => {
  return await page.evaluate(
    function ({ dtText, ddText }: { dtText: string; ddText: string }) {
      const row = Array.from(
        document.querySelectorAll(".job-detail-box-tbl")
      ).find(
        (el) =>
          (el.previousElementSibling as HTMLElement).innerText.trim() === dtText
      );
      if (row) {
        const ele = Array.from(
          row.querySelectorAll(".job-ditail-tbl-inner dd")
        ).find(
          (el) =>
            (el.previousElementSibling as HTMLElement).innerText.trim() ===
            ddText
        );

        if (ele) {
          console.log(
            `ELEMENT FOUND -> dtText = ${dtText}, ddText = ${ddText}`
          );
        } else {
          console.log(
            `ELEMENT NOT FOUND -> dtText = ${dtText}, ddText = ${ddText}`
          );
        }

        return ele ? (ele as HTMLElement).innerText.trim() : "";
      } else {
        return "";
      }
    },
    {
      dtText,
      ddText,
    }
  );
};
