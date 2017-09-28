
//登陆成功过后，初始化RecentListStore数据 
export function initRecentList(data){
    return {
        type: 'INIT_RECENTLIST',
        data
    };

}
//RecentList删除一个item ,index为数组索引
export function deleteRecentItem(index){
    return {
        type: 'DELETE_RECENTITEM',
        index
    };

}
//RecentList更新某个item  lastMessage为false表示只清空未读消息计数红点，而不修改LastMessagew文本  如果是接收消息而调用updateRecentItemLastMessage，则isReceiveMessage为true
export function updateRecentItemLastMessage(client,type,lastMessage,time,isReceiveMessage){
    return (dispatch,getState)=>{
        let isAddUnReadMessage = false;//默认每次不添加未读消息
        //如果是接收到一条消息
        if(isReceiveMessage === true){
            //获取chatDetail状态
            let chatDetail = getState().chatDetailPageStore;
            if(!chatDetail.isChatDetailPageOpen || (chatDetail.isChatDetailPageOpen&&chatDetail.client!==client&&chatDetail.type!==type)){
                isAddUnReadMessage = true;//添加未读消息
            }      
        }
        dispatch({
            type: 'UPDATE_RECENTITEM_LASTMESSAGE',
            Type:type,
            Client:client,
            LastMessage:lastMessage,
            Time:time,
            isAddUnReadMessage
        });
    }

}