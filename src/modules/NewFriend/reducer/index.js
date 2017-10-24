/**
 * Created by Hsu. on 2017/10/23.
 */
const initialState = {
    applicationRecord:[
        {
            info:{
                nickname:'Co_Co',
                avatar:'http://',
                intro:'我是Co_Co',
            },
            state:'wait' //wait:等待 added:已添加 expired:过期
        }
    ]
};
export default function friendApplicationStore(state = initialState,action){
    switch (action.type) {
        case 'INIT_FRIEND_APPLICATION':
            state.applicationRecord = action.messageList;
            return {
                ...state,
            };

        case 'ADD_FRIEND_APPLICATION':
            state.applicationRecord.push(action.message);

            return {
                ...state,
            };

        case 'DELETE_FRIEND_APPLICATION':
            state.applicationRecord.splice(action.index,1);
            return {
                ...state,
            };

        case 'ACCEPT_FRIEND_APPLICATION':
            state.applicationRecord[action.index].status = 'added';
            return {
                ...state,
            };
        case 'UPDATE_FRIEND_APPLICATION':
            state.applicationRecord[action.index].status = 'expired';
            return {
                ...state,
            };
        default:
            return state;
    }
}