"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomStr = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const generateRandomStr = () => {
    const date = moment_timezone_1.default.tz((0, moment_timezone_1.default)(), "Asia/Tokyo").format("YYYY-MM-DD");
    return date + "-1";
};
exports.generateRandomStr = generateRandomStr;
//# sourceMappingURL=generateRandomStr.js.map