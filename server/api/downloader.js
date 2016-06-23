/**
 * Created by allen on 2016/6/20.
 */
"use strict";
var http = require('http');
var fs = require('fs');
var bilibiliConfigs_1 = require('../models/bilibiliConfigs');
var dataUtils_1 = require('../utils/data/dataUtils');
function getCurrentDownloadFormatDateString() {
    return dataUtils_1.formatDate.bind(new Date())('yyyy-MM-dd-hhmm');
}
console.log(getCurrentDownloadFormatDateString());
function getDownloadFullPath(filename) {
    return bilibiliConfigs_1.bilibiliConfigs.downloadFolder + "/" + filename + "-" + getCurrentDownloadFormatDateString() + ".flv";
}
exports.getDownloadFullPath = getDownloadFullPath;
function download(url, filename, cb) {
    var file = fs.createWriteStream(getDownloadFullPath(filename));
    http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            dataUtils_1.isFunction(cb) && cb();
            file.close();
        });
    });
}
exports.download = download;
