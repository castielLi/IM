/**
 * Created by Hsu. on 2017/11/2.
 */
const initialState = {
    isShow:false,
};

export default function FeaturesStore(state=initialState, action){

    switch(action.type){
        case 'SHOW_FEATURES':
            return {
                ...state,
                isShow : true
            };
        case 'HIDE_FEATURES':
            return {
                ...state,
                isShow : false
            };
        default:
            return state;
    }

}