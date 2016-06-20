/**
 * Created by allen on 2016/6/21.
 */
"use strict";
var schedule = require("node-schedule");
var bilibiliConfigs_1 = require("../models/bilibiliConfigs");
var bilibiliService_1 = require("../api/bilibiliService");
var Promise = require('bluebird');
var downloader_1 = require("../api/downloader");
var smsSendService_1 = require("../api/smsSendService");
var scheduleInterval = bilibiliConfigs_1.bilibiliConfigs.scheduleInterval;
function resolveAllVideoStatus() {
    var promisePendingList = [];
    bilibiliConfigs_1.bilibiliConfigs.users.forEach(function (user) {
        promisePendingList.push(bilibiliService_1.getVideoStatus(user.videoId));
    });
    return Promise.all(promisePendingList);
}
exports.resolveAllVideoStatus = resolveAllVideoStatus;
function executeDownloads(statusList) {
    statusList.forEach(function (status, index) {
        if (status) {
            var user_1 = bilibiliConfigs_1.bilibiliConfigs.users[index];
            if (!user_1.$isDownloading) {
                user_1.$isDownloading = true;
                smsSendService_1.sendSMSCode();
                downloader_1.download(user_1.url, user_1.name, function () {
                    user_1.$isDownloading = false;
                });
            }
        }
    });
}
exports.executeDownloads = executeDownloads;
function executeSchedules() {
    var statusCheckingSchedule = schedule.scheduleJob("*/" + scheduleInterval + " * * * *", function () {
        console.log('statusCheckingSchedule', new Date());
        resolveAllVideoStatus().then(function (statusList) {
            console.log('statusList', statusList);
            executeDownloads(statusList);
        });
    });
    return [statusCheckingSchedule];
}
exports.executeSchedules = executeSchedules;
