

const initialState = {
    unReadMessageNumber:0,//未读消息数量
    unDealRequestNumber:0,//未处理请求数量
    unReadZoomMessageNumber:0,//未读朋友圈消息数量
    unSettingNumber:0//我的
};

export default function unReadMessageStore(state=initialState, action){

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
        case 'CLEAR_ALLTABBERMESSAGE_NUMBER':
            return {
                ...initialState
            };
        default:
            return state;
    }

}