/**
 * Created by allen on 2016/6/29.
 */
import {httpGet} from './req';
import {parseString} from 'xml2js';

export function getLinkKey(videoId:number) {
    return httpGet('http://live.bilibili.com/api/playurl?cid=' + videoId, {}).then((xml:string)=> {
        let downloadUrl = null;
        parseString(xml, function (err, result) {
            if (!err && Object.keys(result)) {
                downloadUrl = result.video.durl[0].url[0]
            }
        });
        return downloadUrl;
    });
}
