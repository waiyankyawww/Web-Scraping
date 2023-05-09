"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const linkScraperUrl = process.env.LINK_SCRAPER_URL;
const jobScraperUrl = process.env.JOB_SCRAPER_URL;
const url = process.env.URL;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const index_1 = require("./index");
const browser_1 = require("./browser");
const extract_links_1 = require("./extract-links");
const puppeteer_1 = __importDefault(require("puppeteer"));
const body_parser_1 = __importDefault(require("body-parser"));
// create application/json parser
app.use(body_parser_1.default.text());
let browser;
app.use("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // start browser
    const browserWSEndpoint = yield (0, browser_1.getEndPoint)();
    // connect browser
    browser = yield puppeteer_1.default.connect({ browserWSEndpoint });
    yield next();
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("初めての実行している。。。");
    const page = yield browser.newPage();
    yield (0, index_1.main)({ linkScraperUrl, url, page });
    yield page.close();
    yield browser.close();
    res.end();
}));
app.get("/extract-links", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("クラウドタスクにリクエストされるので、また動いている。。。");
    const page = yield browser.newPage();
    const pageNumber = Number(req.query.pageNumber);
    console.log("Page number is " + pageNumber);
    try {
        // create link for each job
        yield (0, extract_links_1.extractLinks)({ jobScraperUrl, url, page, pageNumber });
        yield page.close();
        yield browser.close();
        res.end();
    }
    catch (error) {
        res
            .status(404)
            .send(`リンクをエキスするときに一部のリンクが見つからない　≫　${error}`);
        res.end();
    }
}));
const port = 8081;
app.listen(port, () => {
    console.log("ポート", port, "でリッスンしている");
    console.log("クローラーシステムを起動している");
    console.log(url);
});
//# sourceMappingURL=server.js.map