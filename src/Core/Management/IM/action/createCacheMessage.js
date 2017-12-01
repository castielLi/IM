/**
 * Created by apple on 2017/11/16.
 */

export function createCacheMessage(message,callback=undefined,onprogress=undefined){

    let cacheMessage = {};
    cacheMessage.MSGID = message.MSGID;
    cacheMessage.message = message;
    cacheMessage.callback = callback;
    cacheMessage.onprogress = onprogress;
    return cacheMessage;
}