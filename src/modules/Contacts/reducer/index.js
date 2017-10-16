/**
 * Created by apple on 2017/6/7.
 */

const initialState = {
    FriendList:[],
    GroupList:[],
    BlackList:[]
};

export default function contactsStore(state=initialState, action){

    switch(action.type){


        case 'INIT_FRIENDLIST':
            return {
                ...state,
                FriendList:action.friendData
            };

        default:
            return state;
    }

}