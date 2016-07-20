import {IncomingMessage} from 'http';
import {formatDate} from '../utils/data/dataUtils';
import {bilibiliConfigs, IUser} from '../models/bilibiliConfigs';
import * as fs from 'fs';
import {WriteStream} from 'fs';

/**
 * Created by allen on 2016/7/19.
 */
function getCurrentDateString():string {
    return formatDate.bind(new Date())('yyyy-MM-dd-hhmm');
}

export function getDownloadFullPath(filename:string):string {
    return `${bilibiliConfigs.downloadFolder}/${filename}-${getCurrentDateString()}.flv`;
}

export function downloadWrite(incomingMessage:IncomingMessage, user:IUser) {
    const fullPath2Write = getDownloadFullPath(user.name);
    let file:WriteStream = fs.createWriteStream(fullPath2Write);
    incomingMessage.pipe(file);
    file.on('finish', function () {
        const ONE_K = 1024 * 1024;
        if (file.bytesWritten < ONE_K) {
            fs.unlinkSync(fullPath2Write);
        }
        file.close();
        console.log(`下载任务结束: [${user.name}]`);
        user.$isDownloading = false;
    });
}

function createFolderIfNonExist() {
    const folderName = bilibiliConfigs.downloadFolder;
    fs.existsSync(folderName) || fs.mkdir(folderName);
}

createFolderIfNonExist();




