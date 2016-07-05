"use strict";
/**
 * Created by allen on 2016/6/21.
 */
var schedule = require('node-schedule');
var bilibiliConfigs_1 = require('../models/bilibiliConfigs');
var bilibiliService_1 = require('../api/bilibiliService');
var Promise = require('bluebird');
var downloader_1 = require('../api/downloader');
var smsSendService_1 = require('../api/smsSendService');
var link_1 = require('../api/link');
var scheduleInterval = bilibiliConfigs_1.bilibiliConfigs.scheduleInterval;
function resolveAllVideoStatus() {
    var promisePendingList = [];
    bilibiliConfigs_1.bilibiliConfigs.users.forEach(function (user) {
        promisePendingList.push(bilibiliService_1.getVideoStatus(user.videoId));
    });
    return Promise.all(promisePendingList);
}
exports.resolveAllVideoStatus = resolveAllVideoStatus;
function executeSMS() {
    return Promise.all(bilibiliConfigs_1.bilibiliConfigs.smsPhoneNumArr.map(function (value) {
        return smsSendService_1.sendSMSCode(value);
    }));
}
exports.executeSMS = executeSMS;
function executeDownloads(statusList, startDownloadCb) {
    statusList.forEach(function (status, index) {
        if (status) {
            var user = bilibiliConfigs_1.bilibiliConfigs.users[index];
            if (!user.$isDownloading) {
                startDownloadCb(user);
            }
        }
    });
}
exports.executeDownloads = executeDownloads;
function executeSchedules() {
    var statusCheckingSchedule = schedule.scheduleJob("*/" + scheduleInterval + " * * * *", function () {
        console.log('statusCheckingSchedule', new Date());
        resolveAllVideoStatus().then(function (statusList) {
            executeDownloads(statusList, function (user) {
                console.log(JSON.stringify(user));
                link_1.getLinkKey(user.videoId).then(function (downloadUrl) {
                    if (downloadUrl) {
                        triggerDownload(user, downloadUrl);
                    }
                });
            });
        });
    });
    return [statusCheckingSchedule];
}
exports.executeSchedules = executeSchedules;
function triggerDownload(user, downloadUrl) {
    user.$isDownloading = true;
    return downloader_1.download(downloadUrl, user.name, function () {
        user.$isDownloading = false;
    });
}
exports.triggerDownload = triggerDownload;
