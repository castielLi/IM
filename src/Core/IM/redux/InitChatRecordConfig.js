//配置如何初始化聊天信息


export default InitChatRecordConfig = {
    INIT_CHAT_RECORD_NUMBER : 3,//打开app，应该为每个聊天对象加载多少条初始数据
    INIT_CHAT_REDUX_NUMBER : 5,//每个聊天对象对应的redux store，最多存放几条消息
}