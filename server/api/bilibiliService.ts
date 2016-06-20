import {httpGet} from "./req";
import {isContains} from "../utils/data/dataUtils";
import {bilibiliConfigs} from "../models/bilibiliConfigs";
/**
 * Created by allen on 2016/6/20.
 */
export function getVideoStatus(videoId:number) {
    const url = "http://live.bilibili.com/api/player";
    const requestData = {
        id: `cid:${videoId}`
    }
    return httpGet(url, requestData).then((data:string)=> {
        return isContains(data, bilibiliConfigs.liveFlag);
    });
}
