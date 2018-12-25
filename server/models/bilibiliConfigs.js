"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function readUserConfig() {
    var workingDirectory = process.cwd();
    var targetConfigFile = path.resolve(workingDirectory, '直播列表.txt');
    if (fs.existsSync(targetConfigFile)) {
        var content = fs.readFileSync(targetConfigFile).toString();
        return content.split('\n').reduce(function (result, row) {
            row = row.trim();
            if (row) {
                var splits = row.split(/\s+/);
                console.log({ splits: splits });
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
var users = readUserConfig();
var configs = require('../../package.json').bilibiliConfigs;
if (users && users.length) {
    configs.users = users;
}
exports.bilibiliConfigs = configs;
