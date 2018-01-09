export function createMessage(group,chatId,sender,data,type){
    if (type == 'text'){
        return {group,chatId,sender,message:data,type}
    }
    else if(type == 'audio'){
        return {group,chatId,sender,message:{localSource:data.localSource,remoteSource:data.remoteSource,time:data.time},type}
    }
    return {group,chatId,sender,message:{localSource:data.localSource,remoteSource:data.remoteSource},type}
}

//编译字符串转移特殊字符
export function compileString(string){
    let str = string.replace(/[~!@#$%^&*()_+=-`\[\]{}\|\'\";:<,>.?\/]/g, "\\$&");
    return str;
}

//解析字符串
export function nalysisString(string){

}

