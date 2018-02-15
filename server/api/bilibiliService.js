"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var req_1 = require("./req");
var dataUtils_1 = require("../utils/data/dataUtils");
var bilibiliConfigs_1 = require("../models/bilibiliConfigs");
/**
 * Created by allen on 2016/6/20.
 */
function getVideoStatus(videoId) {
    var url = "http://live.bilibili.com/api/player";
    var requestData = {
        id: "cid:" + videoId
    };
    return req_1.httpGet(url, requestData).then(function (data) {
        return dataUtils_1.isContains(data, bilibiliConfigs_1.bilibiliConfigs.liveFlag);
    });
}
exports.getVideoStatus = getVideoStatus;
