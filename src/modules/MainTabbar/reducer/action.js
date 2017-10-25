

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

