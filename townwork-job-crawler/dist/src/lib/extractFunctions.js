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
exports.getDataFromTable = exports.selectWithExactClass = void 0;
const selectWithExactClass = ({ page, className, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield page.evaluate(({ className }) => {
        return document.querySelector(className)
            ? document.querySelector(className).innerText.trim()
            : "";
    }, {
        className,
    });
});
exports.selectWithExactClass = selectWithExactClass;
const getDataFromTable = ({ page, dtText, ddText, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield page.evaluate(function ({ dtText, ddText }) {
        const row = Array.from(document.querySelectorAll(".job-detail-box-tbl")).find((el) => el.previousElementSibling.innerText.trim() === dtText);
        if (row) {
            const ele = Array.from(row.querySelectorAll(".job-ditail-tbl-inner dd")).find((el) => el.previousElementSibling.innerText.trim() ===
                ddText);
            if (ele) {
                console.log(`ELEMENT FOUND -> dtText = ${dtText}, ddText = ${ddText}`);
            }
            else {
                console.log(`ELEMENT NOT FOUND -> dtText = ${dtText}, ddText = ${ddText}`);
            }
            return ele ? ele.innerText.trim() : "";
        }
        else {
            return "";
        }
    }, {
        dtText,
        ddText,
    });
});
exports.getDataFromTable = getDataFromTable;
//# sourceMappingURL=extractFunctions.js.map