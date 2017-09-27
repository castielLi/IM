
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
//增加一个item
export function addRecentItem(client,type){
    return {
        type: 'ADD_RECENTITEM',
        Type:type,
        Client:client,
    };

}
//更新某个item最后一条数据
export function updateRecentItemLastMessage(client,type,lastMessage){
    return {
        type: 'UPDATE_RECENTITEM_LASTMESSAGE',
        Type:type,
        Client:client,
        LastMessage:lastMessage
    };

}