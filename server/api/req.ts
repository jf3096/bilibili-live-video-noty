import * as rp from 'request-promise';
import * as Promise from 'bluebird';

/**
 * IRequestOption
 * 请求参数接口
 */
export interface IRequestOption {
    uri:string,
    headers?:Object,
    qs?:Object,
    body?:Object,
    json?:boolean,
    encoding?:string
}

/**
 * MethodEnum
 * 请求方法常量
 */
export enum MethodEnum{
    GET,
    POST
}

/**
 * processOptions
 * 根据OPTION, 加工数据
 */
function processOptions(method:MethodEnum, options:IRequestOption, data:Object) {
    if (method === MethodEnum.GET) {
        options.qs = data;
    } else if (method === MethodEnum.POST) {
        options.body = data;
    } else {
        throw new Error(`req.ts: request method is not allowed. method = ${method}`);
    }
}

/**
 * req
 * 请求模块
 */
function req(uri:string, data:Object, method:MethodEnum):Promise<Object> {
    var options:IRequestOption = <IRequestOption>{
        uri: uri,
    };

    processOptions(method, options, data);

    return rp(options).then((response)=> {
        return Promise.resolve(response);
    }).catch((err)=> {
        return Promise.reject(err);
    });
}

/**
 * httpGet
 * Get请求
 */
export function httpGet(uri:string, data:Object):Promise<Object> {
    return req(uri, data, MethodEnum.GET);
}


/**
 * httpPost
 * Get请求
 */
export function httpPost(uri:string, data:Object):Promise<Object> {
    return req(uri, data, MethodEnum.POST);
}
