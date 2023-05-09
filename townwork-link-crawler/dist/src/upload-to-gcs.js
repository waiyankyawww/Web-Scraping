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
exports.uploadToGCS = void 0;
const storage_1 = require("@google-cloud/storage");
const uploadToGCS = ({ bucketName, fileName }) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = new storage_1.Storage();
    console.log(fileName + "アップロードしている");
    return storage.bucket(bucketName).upload(fileName, {
        destination: "mynavi/" + fileName.split("/")[fileName.split("/").length - 1],
    });
});
exports.uploadToGCS = uploadToGCS;
//# sourceMappingURL=upload-to-gcs.js.map