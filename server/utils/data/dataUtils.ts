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

