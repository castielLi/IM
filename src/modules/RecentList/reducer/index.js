

const initialState = {
    data:[
    ]
};

export default function recentListStore(state=initialState, action){

    switch(action.type){
        case 'INIT_RECENTLIST':
            state.data = action.data
            return {
                ...state
            };

        case 'DELETE_RECENTITEM':
            state.data.splice(action.index, 1);
            return {
                ...state
            };
        case 'ADD_RECENTITEM':
            let isExistItem = false;//recentListStore是否存在这个client对应的item
            state.data.every((v,i)=>{
                if(v.Client === action.Client){
                    isExistItem = true;
                    //终止本次循环
                    return false;
                }
                return true;
            })
            if(isExistItem === false){
                state.data.unshift({Client:action.Client,Type:action.Type,LastMessage:''})
            }
            return {
                ...state
            }; 
        case 'UPDATE_RECENTITEM_LASTMESSAGE':
            let existItem = false;//recentListStore是否存在这个client对应的item
            state.data.every((v,i)=>{
                if(v.Client === action.Client){
                    existItem = true;
                    v.LastMessage = action.LastMessage;
                     //终止本次循环
                    return false;
                }
                 return true;
            })
            if(existItem === false){
                state.data.unshift({Client:action.Client,Type:action.Type,LastMessage:action.LastMessage})
            }
            return {
                ...state
            };
        default:
            return state;
    }

}