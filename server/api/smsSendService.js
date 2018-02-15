"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var req_1 = require("./req");
var bilibiliConfigs_1 = require("../models/bilibiliConfigs");
/**
 * Created by allen on 2016/6/21.
 */
function sendSMSCode(mobile) {
    var url = "http://ksms.temaiyao.com/api/SMSSend/SendSMSCode";
    var requestData = {
        Mobile: mobile,
        Token: bilibiliConfigs_1.bilibiliConfigs.kplus.sysData.Token,
        appSecret: bilibiliConfigs_1.bilibiliConfigs.kplus.sysData.appSecret,
        return_type: bilibiliConfigs_1.bilibiliConfigs.kplus.sysData.return_type
    };
    return req_1.httpGet(url, requestData);
}
exports.sendSMSCode = sendSMSCode;
