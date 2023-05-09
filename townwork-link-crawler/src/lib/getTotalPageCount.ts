import { Page } from "puppeteer";

export const getTotalCount = async (page: Page, URL: string) => {
  try {
    // go to main search result page
    await page.goto(URL, {
      waitUntil: "networkidle0", // wait till all network requests has been processed
      timeout: 600000,
    });
    const totalJobs = await page.$eval(".hit-num", (el: HTMLElement) =>
      Number(el.innerText.replace(/\,/g, ""))
    );
    const totalPages = Math.ceil(totalJobs / 30);
    console.log(`「${totalPages}」 ページが見つかった。。。`);
    return { totalJobs, totalPages };
  } catch (error) {
    console.log(`「${URL}」をいくうちにエラーがある　>>　${error}`);
  }
};
