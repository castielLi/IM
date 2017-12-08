


export function changeUnReadMessageNumber(number){
    return {
        type: 'CHANGE_UNREADMESSAGE_NUMBER',
        number
    };

}


export function changeUnDealRequestNumber(number){
    return {
        type: 'CHANGE_UNDEALREQUEST_NUMBER',
        number
    };

}

export function clearUnDealRequestNumber(){
    return {
        type: 'CLEAR_UNDEALREQUEST_NUMBER',
    };

}

export function clearAllTabberMessageNumber(){
    return {
        type: 'CLEAR_ALLTABBERMESSAGE_NUMBER',
    };

}

//修改mainTabBar默认显示页面
export function changeTabBar(index){
    return {
        type: 'CHANGE_TABBAR',
        index
    }
}

