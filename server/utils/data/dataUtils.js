/**
 * Created by allen on 2016/6/20.
 */
"use strict";
function isString(param) {
    return typeof param === 'string';
}
exports.isString = isString;
function isFunction(param) {
    return typeof param === 'function';
}
exports.isFunction = isFunction;
function isContains(arr, str, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    if (ignoreCase) {
        return arr.toLowerCase().indexOf(str.toLowerCase()) > -1;
    }
    return arr.indexOf(str) > -1;
}
exports.isContains = isContains;
function formatDate(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
exports.formatDate = formatDate;
