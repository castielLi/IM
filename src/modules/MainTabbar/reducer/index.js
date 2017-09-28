/**
 * Created by apple on 2017/6/7.
 */

import * as TYPES from './actionTypes';

const initialState = {
    unReadMessageNumber:0
    }
};

export default function unReadMessageStore(state=initialState, action){

    switch(action.type){


        case 'CHANGE_UNREADMESSAGE_NUMBER':
            return {
                unReadMessageNumber:action.number
            };

        default:
            return state;
    }

}