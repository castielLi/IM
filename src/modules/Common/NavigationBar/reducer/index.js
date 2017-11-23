const initState = {
    isShow:false,
};

export default function NavigationBottomStore(state=initState, action){

    switch(action.type){
        case 'SHOW_NAVIGATIONBOTTOM':
            state.isShow = true;
            return {
                ...state,
            };
        case 'HIDE_NAVIGATIONBOTTOM':
            state.isShow = false;
            return {
                ...state,
            };
        default:
            return state;
    }

}