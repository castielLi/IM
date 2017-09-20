/**
 * Created by apple on 2017/7/12.
 */


export function isObjectEmpty(model){
    if (typeof model === "object" && !(model instanceof Array)){
        var hasProp = true;
        for (var prop in model){
            hasProp = false;
            break;
        }
        return hasProp;
    }
}

export function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

export function cloneArray(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};