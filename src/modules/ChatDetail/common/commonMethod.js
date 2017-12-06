export function createMessage(group,chatId,sender,data,type){
    if (type == 'text'){
        return {group,chatId,sender,message:data,type}
    }
    else if(type == 'audio'){
        return {group,chatId,sender,message:{localSource:data.localSource,remoteSource:data.remoteSource,time:data.time},type}
    }
    return {group,chatId,sender,message:{localSource:data.localSource,remoteSource:data.remoteSource},type}
}