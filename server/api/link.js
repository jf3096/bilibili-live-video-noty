"use strict";
/**
 * Created by allen on 2016/6/29.
 */
var req_1 = require('./req');
var xml2js_1 = require('xml2js');
/**
 * getDownloadUrlByVideoId
 * 通过Video ID获取下载地址
 *
 * @return {Promise<string>} 下载地址Promise对象
 */
function getDownloadUrlByVideoId(videoId) {
    /**
     * 以下请求会返回XML字符串, 该XML字符串为B站可下载的服务站点
     */
    return req_1.httpGet('http://live.bilibili.com/api/playurl', { cid: videoId }).then(function (xml) {
        var downloadUrl = null;
        xml2js_1.parseString(xml, function (err, result) {
            if (!err && Object.keys(result)) {
                downloadUrl = result.video.durl[0].url[0];
            }
        });
        return downloadUrl;
    });
}
exports.getDownloadUrlByVideoId = getDownloadUrlByVideoId;
