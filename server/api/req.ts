import * as rp from 'request-promise';
import * as Promise from 'bluebird';

export interface IRequestOption {
    uri:string,
    headers?:Object,
    qs?:Object,
    body?:Object,
    json?:boolean,
    encoding?:string
}

export enum MethodEnum{
    GET,
    POST
}

function processOptions(method:MethodEnum, options:IRequestOption, data:Object) {
    if (method === MethodEnum.GET) {
        options.qs = data;
    } else if (method === MethodEnum.POST) {
        options.body = data;
    } else {
        throw new Error(`req.ts: request method is not allowed. method = ${method}`);
    }
}

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

export function httpGet(uri:string, data:Object):Promise<Object> {
    return req(uri, data, MethodEnum.GET);
}

export function httpPost(uri:string, data:Object):Promise<Object> {
    return req(uri, data, MethodEnum.POST);
}
