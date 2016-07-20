"use strict";
var dataUtils_1 = require('../utils/data/dataUtils');
var bilibiliConfigs_1 = require('../models/bilibiliConfigs');
var fs = require('fs');
/**
 * Created by allen on 2016/7/19.
 */
function getCurrentDateString() {
    return dataUtils_1.formatDate.bind(new Date())('yyyy-MM-dd-hhmm');
}
function getDownloadFullPath(filename) {
    return bilibiliConfigs_1.bilibiliConfigs.downloadFolder + "/" + filename + "-" + getCurrentDateString() + ".flv";
}
exports.getDownloadFullPath = getDownloadFullPath;
function downloadWrite(incomingMessage, user) {
    var fullPath2Write = getDownloadFullPath(user.name);
    var file = fs.createWriteStream(fullPath2Write);
    incomingMessage.pipe(file);
    file.on('finish', function () {
        var ONE_K = 1024 * 1024;
        if (file.bytesWritten < ONE_K) {
            fs.unlinkSync(fullPath2Write);
        }
        file.close();
        console.log("\u4E0B\u8F7D\u4EFB\u52A1\u7ED3\u675F: [" + user.name + "]");
        user.$isDownloading = false;
    });
}
exports.downloadWrite = downloadWrite;
function createFolderIfNonExist() {
    var folderName = bilibiliConfigs_1.bilibiliConfigs.downloadFolder;
    fs.existsSync(folderName) || fs.mkdir(folderName);
}
createFolderIfNonExist();
