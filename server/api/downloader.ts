/**
 * Created by allen on 2016/6/20.
 */

import * as http from 'http';
import { IncomingMessage } from 'http';

/**
 * LOCATION_CHANGE_STATUS
 * 302重定向
 *
 * @const
 */
const LOCATION_CHANGE_STATUS = 302;

/**
 * download
 * 文件下载模块
 *
 * @return {IncomingMessage} response
 */
export function download(url: string): Promise<IncomingMessage> {
	let loopCounter = 0;
	return new Promise((resolve) => {
		locationDownloadUrl(url, resolve, loopCounter);
	}) as Promise<IncomingMessage>;
}

/**
 * MAX_302_LOOP_TIME
 * 最大循环次数
 *
 * @const
 */
const MAX_302_LOOP_TIME = 10;

/**
 * locationDownloadUrl
 * 下载地址定位
 */
function locationDownloadUrl(url: string, resolve, loopCounter: number): void {
	if (loopCounter === MAX_302_LOOP_TIME) {
		throw new Error('downloader.ts: potential infinite loop for seeking download url address');
	}
	url = url.replace(/^https:/, 'http:');
	http.get(url, function(response: IncomingMessage) {
		if (response.statusCode === LOCATION_CHANGE_STATUS) {
			locationDownloadUrl(response.headers.location, resolve, loopCounter++);
		} else {
			resolve(response);
		}
	});
}