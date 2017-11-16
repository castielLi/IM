

export function addUnReadMessageNumber(){
    return {
        type: 'ADD_UNREADMESSAGE_NUMBER'
    };

}

export function cutUnReadMessageNumber(cutNumber){
    return {
        type: 'CUT_UNREADMESSAGE_NUMBER',
        cutNumber
    };

}

export function initUnReadMessageNumber(number){
    return {
        type: 'INIT_UNREADMESSAGE_NUMBER',
        number
    };

}

export function addUnDealRequestNumber(){
    return {
        type: 'ADD_UNDEALREQUEST_NUMBER'
    };

}

export function cutUnDealRequestNumber(cutNumber){
    return {
        type: 'CUT_UNDEALREQUEST_NUMBER',
        cutNumber
    };

}

export function initUnDealRequestNumber(number){
    return {
        type: 'INIT_UNDEALREQUEST_NUMBER',
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

