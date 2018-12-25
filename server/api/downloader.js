"use strict";
/**
 * Created by allen on 2016/6/20.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
/**
 * LOCATION_CHANGE_STATUS
 * 302重定向
 *
 * @const
 */
var LOCATION_CHANGE_STATUS = 302;
/**
 * download
 * 文件下载模块
 *
 * @return {IncomingMessage} response
 */
function download(url) {
    var loopCounter = 0;
    return new Promise(function (resolve) {
        locationDownloadUrl(url, resolve, loopCounter);
    });
}
exports.download = download;
/**
 * MAX_302_LOOP_TIME
 * 最大循环次数
 *
 * @const
 */
var MAX_302_LOOP_TIME = 10;
/**
 * locationDownloadUrl
 * 下载地址定位
 */
function locationDownloadUrl(url, resolve, loopCounter) {
    if (loopCounter === MAX_302_LOOP_TIME) {
        throw new Error('downloader.ts: potential infinite loop for seeking download url address');
    }
    url = url.replace(/^https:/, 'http:');
    http.get(url, function (response) {
        if (response.statusCode === LOCATION_CHANGE_STATUS) {
            locationDownloadUrl(response.headers.location, resolve, loopCounter++);
        }
        else {
            resolve(response);
        }
    });
}
