const initialState = {
    unReadApplyMessageMark:false,//是否显示未读好友申请标记
};

export  function unReadApplyMessageStore(state=initialState, action){

    switch(action.type){

        case 'SHOW_UNREAD_MARK':
            return {
                unReadApplyMessageMark:true
            };
            break;
        case 'HIDE_UNREAD_MARK':
            return {
                unReadApplyMessageMark:false
            };
            break;
        default:
            return state;
    }

}