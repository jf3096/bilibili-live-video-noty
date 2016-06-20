/**
 * Created by allen on 2016/6/20.
 */
"use strict";
function aop(concreteFn) {
    var middlewareArr = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewareArr[_i - 1] = arguments[_i];
    }
    middlewareArr.unshift(concreteFn);
    return middlewareArr.reduce(function (prev, cur) {
        return cur(prev);
    });
}
exports.aop = aop;
