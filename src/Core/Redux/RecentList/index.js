

const initialState = {
    data:[
    ]
};
//{data:[{Client: "wg000008", Type: "private", LastMessage: "222", unReadMessageCount:'',Time: 1508231012500,Nick:'玩玩',localImage:'',avator:'',}]}
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
        case 'DELETE_RECENTITEM_FROM_ID':
            state.data.every((v,i,arr)=>{
                if(v.Client === action.id){
                    arr.splice(i,1);
                    //终止循环
                    return false;
                }
                return true;
            })
            return {
                ...state
            };
        case 'CLEAR_RECENTLIST':

            return {
                data:[]
            };
        case 'UPDATE_RECENTITEM_LASTMESSAGE':
            let existItem = false;//recentListStore是否存在这个client对应的item
            state.data.every((v,i)=>{
                if(v.Client === action.Client){
                    //说明recentListStore存在对应的item
                    existItem = true;                  
                    if(action.LastMessage === false){
                        v.unReadMessageCount = 0;
                    }else{
                        v.LastMessage = action.LastMessage;
                        v.Time = action.Time
                    }          
                    //如果允许添加未读消息
                    if(action.isAddUnReadMessage===true){
                        v.unReadMessageCount = v.unReadMessageCount?(v.unReadMessageCount+1):1;
                    }
                    //终止循环
                    return false;
                }
                 return true;
            })
            //recentListStore不存在对应的item
            if(existItem === false){
                if(action.LastMessage === false){
                    return state;
                }
                let obj = {Client:action.Client,Type:action.Type,LastMessage:action.LastMessage,Time:action.Time};
                //如果允许添加未读消息
                if(action.isAddUnReadMessage===true){
                    obj.unReadMessageCount = 1;
                }
                state.data.unshift(obj)
            }          
            return {
                ...state
            };
        default:
            return state;
    }

}