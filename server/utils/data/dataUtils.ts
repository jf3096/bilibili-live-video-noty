/**
 * Created by allen on 2016/6/20.
 */


export function isString(param:any) {
    return typeof param === 'string';
}

export function isFunction(param:any) {
    return typeof param === 'function';
}

export function isContains(arr:string, str:string, ignoreCase:boolean = false):boolean {
    if (ignoreCase) {
        return arr.toLowerCase().indexOf(str.toLowerCase()) > -1;
    }
    return arr.indexOf(str) > -1;
}

export function formatDate(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
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