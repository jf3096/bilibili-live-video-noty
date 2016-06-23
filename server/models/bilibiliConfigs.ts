/**
 * Created by allen on 2016/6/20.
 */

export interface IUser {
    name:string;
    videoId:number;
    url:string;
    $isDownloading?:boolean;
}

export interface ISysData {
    Token:string;
    appSecret:string;
    return_type:string;
}

export interface IKPlus {
    sysData:ISysData;
}


export interface IBilibiliConfigs {
    scheduleInterval:number; // minutes
    liveFlag:string;
    downloadFolder:string;
    smsPhoneNumArr:number[];
    users:IUser[];
    kplus:IKPlus;
}

export const bilibiliConfigs:IBilibiliConfigs = require('../../package.json').bilibiliConfigs;