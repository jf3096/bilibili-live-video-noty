"use strict";
/**
 * Created by allen on 2016/6/29.
 */
var req_1 = require('./req');
var xml2js_1 = require('xml2js');
function getLinkKey(videoId) {
    return req_1.httpGet('http://live.bilibili.com/api/playurl?cid=' + videoId, {}).then(function (xml) {
        var downloadUrl = null;
        xml2js_1.parseString(xml, function (err, result) {
            if (!err && Object.keys(result)) {
                downloadUrl = result.video.durl[0].url[0];
            }
        });
        return downloadUrl;
    });
}
exports.getLinkKey = getLinkKey;
