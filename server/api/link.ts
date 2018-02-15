/**
 * Created by allen on 2016/6/29.
 */
import {httpGet} from './req';
import * as invariant from 'invariant';

/**
 * getDownloadUrlByVideoId
 * 通过Video ID获取下载地址
 *
 * @return {Promise<string>} 下载地址Promise对象
 */
export async function getDownloadUrlByVideoId(videoId: number): Promise<string> {
    /**
     * 以下请求返回下载列表
     * https://api.live.bilibili.com/room/v1/Room/playUrl?cid=381652&quality=0&platform=web
     */
    const response = JSON.parse(await httpGet('https://api.live.bilibili.com/room/v1/Room/playUrl', {cid: videoId}) as string);
    const {code, msg, data} = response as any;
    invariant(code === 0 /** 成功 */, `getDownloadUrlByVideoId: 请求失败，状态码: ${code}, 信息：${msg}`);
    const {durl} = data;
    const {url} = durl[0];
    return url;
}
