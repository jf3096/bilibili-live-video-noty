/**
 * Created by allen on 2016/6/21.
 */

import * as schedule from "node-schedule";
import {bilibiliConfigs, IUser} from "../models/bilibiliConfigs";
import {getVideoStatus} from "../api/bilibiliService";
import * as Promise from 'bluebird';
import {download} from "../api/downloader";
import {sendSMSCode} from "../api/smsSendService";
const scheduleInterval = bilibiliConfigs.scheduleInterval;

export function resolveAllVideoStatus() {
    let promisePendingList:Promise<boolean>[] = [];
    bilibiliConfigs.users.forEach((user:IUser)=> {
        promisePendingList.push(getVideoStatus(user.videoId))
    });
    return Promise.all(promisePendingList);
}

export function executeDownloads(statusList:boolean[]) {
    statusList.forEach((status:boolean, index:number)=> {
        if (status) {
            const user:IUser = bilibiliConfigs.users[index];
            if (!user.$isDownloading) {
                user.$isDownloading = true;
                sendSMSCode();
                download(user.url, user.name, ()=> {
                    user.$isDownloading = false;
                });
            }
        }
    })
}

export function executeSchedules() {
    const statusCheckingSchedule = schedule.scheduleJob(`*/${scheduleInterval} * * * *`, function () {
        console.log('statusCheckingSchedule', new Date());
        resolveAllVideoStatus().then((statusList:boolean[])=> {
            console.log('statusList', statusList);
            executeDownloads(statusList);
        });
    });
    return [statusCheckingSchedule]
}
