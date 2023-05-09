import puppeteer from "puppeteer";

export const getEndPoint = async () => {
  let browser;
  try {
    console.log("ブラウザを開くのをお待ちください。。。");
    // launching browser (no browser ui open >>  headless:true)
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: [
        "--disable-gpu",
        "--no-sandbox",
        "--use-gl=egl",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      ignoreHTTPSErrors: true,
    });

    // calling a web service endpointer
    const browserWsEndpoint = await browser.wsEndpoint();

    return browserWsEndpoint;
  } catch (err) {
    console.log("ブラウザインスタンスを作成できませんでした。 => : ", err);
  }
};
