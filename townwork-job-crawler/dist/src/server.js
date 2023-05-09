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
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const index_1 = require("./index");
const browser_1 = require("./browser");
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
app.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // start browser
    const browserWSEndpoint = yield (0, browser_1.getEndPoint)();
    // connect browser
    const browser = yield puppeteer_1.default.connect({ browserWSEndpoint });
    const page = yield browser.newPage();
    yield page.setDefaultNavigationTimeout(60000);
    const url = req.query.url.toString();
    const pageNo = req.query.pageNo.toString();
    const queryDate = req.query.date;
    if (!queryDate) {
        return res.status(400).json({
            message: "date is not provided"
        });
    }
    const date = new Date(queryDate);
    const yearMonthDay = (0, moment_1.default)(date).format("YYYYMMDD");
    yield (0, index_1.main)({ page, url, pageNo, yearMonthDay });
    yield page.close();
    yield browser.close();
    res.end();
}));
const port = 8082;
app.listen(port, () => {
    console.log("ポート", port, "でリッスンしている");
    console.log("クローラーシステムを起動している");
});
//# sourceMappingURL=server.js.map