/**
 * Created by apple on 2017/6/7.
 */

const initialState = {};

export default function relationStore(state=initialState, action){

    switch(action.type){


        case 'INIT_RELATION':
            return action.relationArr;

        default:
            return state;
    }

}