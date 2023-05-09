import * as dotenv from "dotenv";
dotenv.config();

import { scrapeLink } from "./page-controller";
import { Page } from "puppeteer";

interface Args {
  linkScraperUrl: string;
  url: string;
  page: Page;
}

export const main = async ({ linkScraperUrl, url, page }: Args) => {
  try {
    console.log("全部のジョブ情報をクロールしている。。。");
    await scrapeLink({
      linkScraperUrl,
      page,
      url,
    });
  } catch (error) {
    console.log("「scrapeAll」機能のなかでエラーがある。。。" + error);
  }
};
