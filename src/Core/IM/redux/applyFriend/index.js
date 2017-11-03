/**
 * Created by Hsu. on 2017/10/23.
 */
const initialState = {
    applicationRecord:[

    ]
};
import ApplyFriendEnum from '../../dto/ApplyFriendEnum';
//wait:等待 added:已添加 expired:过期
export default function friendApplicationStore(state = initialState,action){
    switch (action.type) {
        case 'INIT_FRIEND_APPLICATION':
            state.applicationRecord = action.messageList;
            return {
                ...state,
            };

        case 'ADD_FRIEND_APPLICATION':
            for(let i = 0;i<state.applicationRecord.length;i++){
                if(action.message.send === state.applicationRecord[i].send){
                    state.applicationRecord[i] = action.message;
                    return {
                        ...state,
                    }
                }
            }
            state.applicationRecord.push(action.message);
            return {
                ...state,
            };


            // return {
            //     ...state,
            //     applicationRecord:state.applicationRecord.concat([])
            // };

        case 'DELETE_FRIEND_APPLICATION':
            state.applicationRecord.splice(action.index,1);
            return {
                ...state,
            };

        case 'ACCEPT_FRIEND_APPLICATION':
            for(let i = 0;i<state.applicationRecord.length;i++){
                if(action.key === state.applicationRecord[i].key){
                    state.applicationRecord[i].status = ApplyFriendEnum.ADDED;
                    return {
                        ...state,
                    }
                }
            };
        case 'UPDATE_FRIEND_APPLICATION':
            state.applicationRecord[action.index].status = ApplyFriendEnum.EXPIRED;
            return {
                ...state,
            };
        case 'CLEAR_FRIEND_APPLICATION':
            return {
                ...initialState,
            };
        default:
            return state;
    }
}