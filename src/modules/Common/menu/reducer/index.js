/**
 * Created by Hsu. on 2017/11/2.
 */
const initialState = {
    isShow:false,
};

export default function FeaturesStore(state=initialState, action){

    switch(action.type){
        case 'SHOW_FEATURES':
            state.isShow = true;
            return {
                ...state,
            };
        case 'HIDE_FEATURES':
            state.isShow = false;
            return {
                ...state,
            };
        default:
            return state;
    }

}