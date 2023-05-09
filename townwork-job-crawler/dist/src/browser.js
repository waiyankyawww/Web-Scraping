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
exports.getEndPoint = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const getEndPoint = () => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    try {
        console.log("ブラウザを開くのをお待ちください。。。");
        // launching browser (no browser ui open >>  headless:true)
        browser = yield puppeteer_1.default.launch({
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
        const browserWsEndpoint = yield browser.wsEndpoint();
        return browserWsEndpoint;
    }
    catch (err) {
        console.log("ブラウザインスタンスを作成できませんでした。 => : ", err);
    }
});
exports.getEndPoint = getEndPoint;
//# sourceMappingURL=browser.js.map