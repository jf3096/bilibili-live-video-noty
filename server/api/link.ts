/**
 * Created by allen on 2016/6/29.
 */
import {httpGet} from './req';
import {parseString} from 'xml2js';


/**
 * getDownloadUrlByVideoId
 * 通过Video ID获取下载地址
 *
 * @return {Promise<string>} 下载地址Promise对象
 */
export function getDownloadUrlByVideoId(videoId:number):Promise<string> {
    /**
     * 以下请求会返回XML字符串, 该XML字符串为B站可下载的服务站点
     */
    return httpGet('http://live.bilibili.com/api/playurl', {cid: videoId}).then((xml:string)=> {
            let downloadUrl = null;
            parseString(xml, function (err, result) {
                if (!err && Object.keys(result)) {
                    downloadUrl = result.video.durl[0].url[0]
                }
            });
            return downloadUrl;
        }
    )
}
