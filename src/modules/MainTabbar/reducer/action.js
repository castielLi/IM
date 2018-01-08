


export function changeUnReadMessageNumber(number){
    let needNumber = number>99?'99+':number;
    return {
        type: 'CHANGE_UNREADMESSAGE_NUMBER',
        number:needNumber
    };

}

export function showUnDealRequest(){
    return {
        type: 'SHOW_UNDEALREQUEST',
    };
}

export function hideUnDealRequest(){
    return {
        type: 'HIDE_UNDEALREQUEST',
    };
}

export function changeUnReadZoomMessageNumber(number){
    return {
        type: 'CHANGE_UNREADZOOMMESSAGE_NUMBER',
        number
    };

}

export function changeUnSettingNumber(number){
    return {
        type: 'CHANGE_UNSETTING_NUMBER',
        number
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

