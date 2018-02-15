/**
 * Created by allen on 2016/6/21.
 */
import * as schedule from 'node-schedule';
import {bilibiliConfigs, IUser} from '../models/bilibiliConfigs';
import {getVideoStatus} from '../api/bilibiliService';
import * as Promise from 'bluebird';
import {download} from '../api/downloader';
import {sendSMSCode} from '../api/smsSendService';
import {getDownloadUrlByVideoId} from '../api/link';
import {IncomingMessage} from 'http';
import {downloadWrite} from '../io/fileSteam';

const scheduleInterval = bilibiliConfigs.scheduleInterval;

/**
 * resolveVideosStatus
 * 异步Promise检查视频是否直播中
 *
 * @return {Promise<boolean[]>} 标明Package.json列表中当前是否直播中
 */
export function resolveVideosStatus(): Promise<boolean[]> {
    let promisePendingList: Promise<boolean>[] = [];
    bilibiliConfigs.users.forEach((user: IUser) => {
        const statusPromise = getVideoStatus(user.videoId);
        promisePendingList.push(statusPromise);
    });
    return Promise.all(promisePendingList);
}

/**
 * executeSMS
 * 执行/发送短信
 *
 * @depreciate 已过期
 * @return {Promise<Object>} 发送短信提醒当前存在直播
 */
export function executeSMS(): Promise<Object[]> {
    return Promise.all(bilibiliConfigs.smsPhoneNumArr.map((value: number) => {
        return sendSMSCode(value);
    }));
}

/**
 * executeDownloads
 * 执行下载任务
 *
 * @return {void} 判定并触发下载动作
 */
export function executeDownloads(statusList: boolean[]): Promise<IUser>[] {
    return statusList.map((status: boolean, index: number) => {
        if (status) {
            const user: IUser = bilibiliConfigs.users[index];
            return Promise.resolve(user);
        }
        return Promise.resolve(null);
    })
}

/**
 * executeSchedules
 * 执行日常任务
 *
 * @return {void} 判定并触发下载动作
 */
export function executeSchedules() {
    const statusCheckingSchedule = schedule.scheduleJob(`*/${scheduleInterval} * * * *`, function () {
        let usersContainer;
        console.log('视频状态检测中... ', new Date());
        return resolveVideosStatus().then((statusList: boolean[]) => {
            return executeDownloads(statusList);
        }).all().then((users: IUser[]) => {
            usersContainer = users;
            console.log(users);
            return getReadyDownloadUserList(users)
        }).all().then((urls: string[]) => {
            return triggerDownload(usersContainer, urls)
        });
    });
    return [statusCheckingSchedule]
}

/**
 * getReadyDownloadUserList
 * 获取准备好的下载用户列表
 *
 * @return {Promise<string>[]} 获取可以下载的URL列表
 */
export function getReadyDownloadUserList(users: IUser[]): Promise<string>[] {
    return users.map((user) => {
        if (user && user.videoId) {
            return getDownloadUrlByVideoId(user.videoId);
        }
        return Promise.resolve(null);
    })
}

/**
 * triggerDownload
 * 触发下载事件
 *
 * @return {Promise<string>[]} 返回下载流
 */
export function triggerDownload(users: IUser[], downloadUrls: string[]): Promise<IncomingMessage>[] {
    return users.map((user: IUser, index: number) => {
        if (user && downloadUrls[index]) {
            return download(downloadUrls[index]).then((incomingMessage: IncomingMessage) => {
                const targetUser = bilibiliConfigs.users[index];
                if (!targetUser.$isDownloading) {
                    targetUser.$isDownloading = true;
                    console.log(`创建新下载任务: [${targetUser.name}]`);
                    downloadWrite(incomingMessage, targetUser);
                }
                return null;
            });
        }
    })
}
