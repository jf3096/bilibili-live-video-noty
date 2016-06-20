/**
 * Created by allen on 2016/6/20.
 */

export type AOP_FUNC = (func?:Function)=>((func?:Function)=>Function);

export function aop(concreteFn:AOP_FUNC, ...middlewareArr:AOP_FUNC[]) {
    middlewareArr.unshift(concreteFn);
    return middlewareArr.reduce((prev:AOP_FUNC, cur:Function)=> {
        return cur(prev);
    });
}

