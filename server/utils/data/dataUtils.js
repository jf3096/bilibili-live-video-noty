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
