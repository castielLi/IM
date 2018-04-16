

const initialState = {
    unReadMessageNumber:0,//未读消息数量
    unDealRequestMark:false,//未处理请求数量
    unReadZoomMessageNumber:0,//未读朋友圈消息数量
    unSettingNumber:0,//我的
    contactsNeedRefreshTime:new Date().getTime()
};

export  function unReadMessageStore(state=initialState, action){

    switch(action.type){

        case 'CHANGE_CONTACT_NEEDREFRESHTIME':
            return {
                ...state,
                contactsNeedRefreshTime:action.time
            };

        case 'CHANGE_UNREADMESSAGE_NUMBER':
            return {
                ...state,
                unReadMessageNumber:action.number
            };
        case 'SHOW_UNDEALREQUEST':
            return {
                ...state,
                unDealRequestMark:true
            };
        case 'HIDE_UNDEALREQUEST':
            return {
                ...state,
                unDealRequestMark:false
            };
        case 'CHANGE_UNREADZOOMMESSAGE_NUMBER':
            return {
                ...state,
                unReadZoomMessageNumber:action.number
            };
        case 'CHANGE_UNSETTING_NUMBER':
            return {
                ...state,
                unSettingNumber:action.number
            };
        case 'CLEAR_ALLTABBERMESSAGE_NUMBER':
            return {
                ...initialState
            };

        default:
            return state;
    }

}

const initialTabBarState = 0;

export  function tabBarStore(state=initialTabBarState,action){
    switch(action.type){


        case 'CHANGE_TABBAR':
            return action.index

        default:
            return state;
    }

}