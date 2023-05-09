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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalCount = void 0;
const getTotalCount = (page, URL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // go to main search result page
        yield page.goto(URL, {
            waitUntil: "networkidle0",
            timeout: 600000,
        });
        const totalJobs = yield page.$eval(".hit-num", (el) => Number(el.innerText.replace(/\,/g, "")));
        const totalPages = Math.ceil(totalJobs / 30);
        console.log(`「${totalPages}」 ページが見つかった。。。`);
        return { totalJobs, totalPages };
    }
    catch (error) {
        console.log(`「${URL}」をいくうちにエラーがある　>>　${error}`);
    }
});
exports.getTotalCount = getTotalCount;
//# sourceMappingURL=getTotalPageCount.js.map