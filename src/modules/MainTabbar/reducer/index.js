

const initialState = {
    unReadMessageNumber:0,//未读消息数量
    unDealRequestNumber:0,//未处理请求数量
    unReadZoomMessageNumber:0,//未读朋友圈消息数量
    unSettingNumber:0//我的
};

export  function unReadMessageStore(state=initialState, action){

    switch(action.type){


        case 'ADD_UNREADMESSAGE_NUMBER':
            return {
                ...state,
                unReadMessageNumber:state.unReadMessageNumber+1
            };
        case 'CUT_UNREADMESSAGE_NUMBER':
            return {
                ...state,
                unReadMessageNumber:state.unReadMessageNumber-action.cutNumber
            };
        case 'INIT_UNREADMESSAGE_NUMBER':
            return {
                ...state,
                unReadMessageNumber:action.number
            };
        case 'ADD_UNDEALREQUEST_NUMBER':
            return {
                ...state,
                unDealRequestNumber:state.unDealRequestNumber+1
            };
        case 'CUT_UNDEALREQUEST_NUMBER':
            return {
                ...state,
                unDealRequestNumber:state.unDealRequestNumber-action.cutNumber
            };
        case 'INIT_UNDEALREQUEST_NUMBER':
            return {
                ...state,
                unDealRequestNumber:action.number
            };
        case 'CLEAR_UNDEALREQUEST_NUMBER':
            return {
                ...state,
                unDealRequestNumber:0
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