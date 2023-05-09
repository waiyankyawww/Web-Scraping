import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import puppeteer from "puppeteer";

import { main } from "./index";
import { getEndPoint } from "./browser";
import moment from "moment";

const app = express();

app.get("/", async (req, res, next) => {
  // start browser
  const browserWSEndpoint = await getEndPoint();
  // connect browser
  const browser = await puppeteer.connect({ browserWSEndpoint });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);

  const url = req.query.url.toString();
  const pageNo = req.query.pageNo ? req.query.pageNo.toString() : "1";

  const queryDate = req.query.date as string | undefined;
  if(!queryDate) {
    return res.status(400).json({
      message: "date is not provided"
    })
  }
  const date = new Date(queryDate)
  const yearMonthDay = moment(date).format("YYYYMMDD");

  await main({ page, url, pageNo, yearMonthDay });
  await page.close();
  await browser.close();
  res.end();
});

const port =  process.env.PORT || 8080;
app.listen(port, () => {
  console.log("ポート", port, "でリッスンしている");
  console.log("クローラーシステムを起動している");
});
