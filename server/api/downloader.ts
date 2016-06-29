/**
 * Created by allen on 2016/6/20.
 */

import * as http from 'http';
import * as fs from 'fs';
import {WriteStream} from 'fs';
import {bilibiliConfigs} from '../models/bilibiliConfigs';
import {isFunction, formatDate} from '../utils/data/dataUtils';

function getCurrentDownloadFormatDateString():string {
    return formatDate.bind(new Date())('yyyy-MM-dd-hhmm');
}

export function getDownloadFullPath(filename:string):string {
    return `${bilibiliConfigs.downloadFolder}/${filename}-${getCurrentDownloadFormatDateString()}.flv`;
}

export function download(url:string, filename:string, cb?:Function) {
    let file:WriteStream = fs.createWriteStream(getDownloadFullPath(filename));
    http.get(url, function (response) {
        if (response.statusCode === 302) {
            download(response.headers.location, filename, cb);
            return;
        }
        response.pipe(file);
        file.on('finish', function () {
            isFunction(cb) && cb();
            file.close();
        });
    });
}