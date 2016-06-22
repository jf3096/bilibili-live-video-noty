import {httpGet} from './req';
import {bilibiliConfigs} from '../models/bilibiliConfigs';
/**
 * Created by allen on 2016/6/21.
 */

export function sendSMSCode() {
    const url = "http://ksms.temaiyao.com/api/SMSSend/SendSMSCode";
    const requestData = {
        Mobile: bilibiliConfigs.smsPhoneNum,
        Token: bilibiliConfigs.kplus.sysData.Token,
        appSecret: bilibiliConfigs.kplus.sysData.appSecret,
        return_type: bilibiliConfigs.kplus.sysData.return_type
    };
    return httpGet(url, requestData);
}
