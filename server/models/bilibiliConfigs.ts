import * as fs from 'fs';
import * as path from 'path';

/**
 * Created by allen on 2016/6/20.
 */

export interface IUser {
	name: string;
	videoId: number;
	$isDownloading?: boolean;
}

export interface ISysData {
	Token: string;
	appSecret: string;
	return_type: string;
}

export interface IKPlus {
	sysData: ISysData;
}


export interface IBilibiliConfigs {
	scheduleInterval: number; // minutes
	liveFlag: string;
	downloadFolder: string;
	smsPhoneNumArr: number[];
	users: IUser[];
	kplus: IKPlus;
}

function readUserConfig() {
	const workingDirectory = process.cwd();
	const targetConfigFile = path.resolve(workingDirectory, '直播列表.txt');
	if (fs.existsSync(targetConfigFile)) {
		const content = fs.readFileSync(targetConfigFile).toString();
		return content.split('\n').reduce((result, row) => {
			row = row.trim();
			if (row) {
				const splits = row.split(/\s+/);
				if (splits.length > 1) {
					result.push({
						videoId: splits[0].trim(),
						name: splits[1].trim(),
					});
				}
			}
			return result;
		}, []);
	}
	return undefined;
}

const users = readUserConfig();
const configs = require('../../package.json').bilibiliConfigs;

if (users && users.length) {
	configs.users = users;
}

export const bilibiliConfigs: IBilibiliConfigs = configs;