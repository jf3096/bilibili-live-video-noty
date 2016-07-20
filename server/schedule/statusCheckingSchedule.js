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
var fileSteam_1 = require('../io/fileSteam');
var scheduleInterval = bilibiliConfigs_1.bilibiliConfigs.scheduleInterval;
/**
 * resolveVideosStatus
 * 异步Promise检查视频是否直播中
 *
 * @return {Promise<boolean[]>} 标明Package.json列表中当前是否直播中
 */
function resolveVideosStatus() {
    var promisePendingList = [];
    bilibiliConfigs_1.bilibiliConfigs.users.forEach(function (user) {
        promisePendingList.push(bilibiliService_1.getVideoStatus(user.videoId));
    });
    return Promise.all(promisePendingList);
}
exports.resolveVideosStatus = resolveVideosStatus;
/**
 * executeSMS
 * 执行/发送短信
 *
 * @depreciate 已过期
 * @return {Promise<Object>} 发送短信提醒当前存在直播
 */
function executeSMS() {
    return Promise.all(bilibiliConfigs_1.bilibiliConfigs.smsPhoneNumArr.map(function (value) {
        return smsSendService_1.sendSMSCode(value);
    }));
}
exports.executeSMS = executeSMS;
/**
 * executeDownloads
 * 执行下载任务
 *
 * @return {void} 判定并触发下载动作
 */
function executeDownloads(statusList) {
    return statusList.map(function (status, index) {
        if (status) {
            var user = bilibiliConfigs_1.bilibiliConfigs.users[index];
            return Promise.resolve(user);
        }
        return Promise.resolve(null);
    });
}
exports.executeDownloads = executeDownloads;
/**
 * executeSchedules
 * 执行日常任务
 *
 * @return {void} 判定并触发下载动作
 */
function executeSchedules() {
    var statusCheckingSchedule = schedule.scheduleJob("*/" + scheduleInterval + " * * * *", function () {
        var usersContainer;
        console.log('视频状态检测中... ', new Date());
        return resolveVideosStatus().then(function (statusList) {
            return executeDownloads(statusList);
        }).all().then(function (users) {
            usersContainer = users;
            console.log(users);
            return getReadyDownloadUserList(users);
        }).all().then(function (urls) {
            return triggerDownload(usersContainer, urls);
        });
    });
    return [statusCheckingSchedule];
}
exports.executeSchedules = executeSchedules;
/**
 * getReadyDownloadUserList
 * 获取准备好的下载用户列表
 *
 * @return {Promise<string>[]} 获取可以下载的URL列表
 */
function getReadyDownloadUserList(users) {
    return users.map(function (user) {
        if (user && user.videoId) {
            return link_1.getDownloadUrlByVideoId(user.videoId);
        }
        return Promise.resolve(null);
    });
}
exports.getReadyDownloadUserList = getReadyDownloadUserList;
/**
 * triggerDownload
 * 触发下载事件
 *
 * @return {Promise<string>[]} 返回下载流
 */
function triggerDownload(users, downloadUrls) {
    return users.map(function (user, index) {
        if (user && downloadUrls[index]) {
            return downloader_1.download(downloadUrls[index]).then(function (incomingMessage) {
                var targetUser = bilibiliConfigs_1.bilibiliConfigs.users[index];
                if (!targetUser.$isDownloading) {
                    targetUser.$isDownloading = true;
                    console.log("\u521B\u5EFA\u65B0\u4E0B\u8F7D\u4EFB\u52A1: [" + targetUser.name + "]");
                    fileSteam_1.downloadWrite(incomingMessage, targetUser);
                }
                return null;
            });
        }
    });
}
exports.triggerDownload = triggerDownload;
