"use strict";
var rp = require('request-promise');
var Promise = require('bluebird');
/**
 * MethodEnum
 * 请求方法常量
 */
(function (MethodEnum) {
    MethodEnum[MethodEnum["GET"] = 0] = "GET";
    MethodEnum[MethodEnum["POST"] = 1] = "POST";
})(exports.MethodEnum || (exports.MethodEnum = {}));
var MethodEnum = exports.MethodEnum;
/**
 * processOptions
 * 根据OPTION, 加工数据
 */
function processOptions(method, options, data) {
    if (method === MethodEnum.GET) {
        options.qs = data;
    }
    else if (method === MethodEnum.POST) {
        options.body = data;
    }
    else {
        throw new Error("req.ts: request method is not allowed. method = " + method);
    }
}
/**
 * req
 * 请求模块
 */
function req(uri, data, method) {
    var options = {
        uri: uri,
    };
    processOptions(method, options, data);
    return rp(options).then(function (response) {
        return Promise.resolve(response);
    }).catch(function (err) {
        return Promise.reject(err);
    });
}
/**
 * httpGet
 * Get请求
 */
function httpGet(uri, data) {
    return req(uri, data, MethodEnum.GET);
}
exports.httpGet = httpGet;
/**
 * httpPost
 * Get请求
 */
function httpPost(uri, data) {
    return req(uri, data, MethodEnum.POST);
}
exports.httpPost = httpPost;
