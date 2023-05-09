import * as dotenv from "dotenv";
dotenv.config();

const linkScraperUrl = process.env.LINK_SCRAPER_URL;
const jobScraperUrl = process.env.JOB_SCRAPER_URL;
const url = process.env.URL;

import express from "express";
const app = express();
import { main } from "./index";

import { getEndPoint } from "./browser";
import { extractLinks } from "./extract-links";
import puppeteer, { Browser } from "puppeteer";
import bodyParser from "body-parser";

// create application/json parser
app.use(bodyParser.text());

let browser: Browser;

app.use("/", async (req, res, next) => {
  // start browser
  const browserWSEndpoint = await getEndPoint();

  // connect browser
  browser = await puppeteer.connect({ browserWSEndpoint });
  await next();
});

app.get("/", async (req, res) => {
  console.log("初めての実行している。。。");
  const page = await browser.newPage();

  await main({ linkScraperUrl, url, page });
  await page.close();
  await browser.close();
  res.end();
});

app.get("/extract-links", async (req, res) => {
  console.log("クラウドタスクにリクエストされるので、また動いている。。。");

  const page = await browser.newPage();

  const pageNumber = Number(req.query.pageNumber);

  console.log("Page number is " + pageNumber);
  try {
    // create link for each job
    await extractLinks({ jobScraperUrl, url, page, pageNumber });
    await page.close();
    await browser.close();
    res.end();
  } catch (error) {
    res
      .status(404)
      .send(`リンクをエキスするときに一部のリンクが見つからない　≫　${error}`);
    res.end();
  }
});

const port =  8081;
app.listen(port, () => {
  console.log("ポート", port, "でリッスンしている");
  console.log("クローラーシステムを起動している");
  console.log(url);
});
