/**
 * Created by allen on 2016/6/20.
 */

import * as http from 'http';
import * as fs from 'fs';
import {bilibiliConfigs} from "../models/bilibiliConfigs";
import {WriteStream} from "fs";
import {isFunction} from "../utils/data/dataUtils";

export function getDownloadFullPath(filename:string):string {
    return `${bilibiliConfigs.downloadFolder}/${filename}-${+new Date()}.flv`;
}

export function download(url:string, filename:string, cb?:Function) {
    let file:WriteStream = fs.createWriteStream(getDownloadFullPath(filename));
    http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            isFunction(cb) && cb();
            file.close();
        });
    });
}