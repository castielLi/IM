//用于处理聊天页面聊天记录的reducer
//state示例
// {
//     ChatRecord:{
//         'li':[
//                 {status:'loading',
//                 message:{                 
//                         MSGID:'',
//                         Command:6,//
//                         Resource:[{
//                             FileType:0,//0:image、1:video、3:audio
//                             LocalSource:'',//网络路径
//                             RemoteSource:'',//本地路径
//                         }],
//                 Data:{
//                     IsAck :true;
//                     IsOfflineSaved :false,
//                     IsHistorySaved :false,
//                     IsOfflineNotify :true,
//                     LocalTime :"",
//                     Command : 1,
//                     //ServerTime :"",
//                     Data :{
//                         Command : 1,
//                         Data :"",//如果非文本数据，则为空。如果是文本数据则为文本内容
//                         Sender :"",
//                         Receiver :"",
//                     }
//                 },
//                 type:'',//text、image 
//                 way:'',//privte、chatroom
//                 status:''//        
//                  }
//             }
//         ]
//     }
// }
import InitChatRecordConfig from './InitChatRecordConfig';
const initialState = {
    hasGetChatRecord:false,//是否初始化聊天数据完毕
    ChatRecord: {}
}
export default function chatRecordStore(state = initialState, action) {
    switch (action.type) {
        case 'INIT_CHATRECORD':
            state.ChatRecord = action.chatRecord;
            return{
                ...state,
                hasGetChatRecord:true
            }
        //第一次聊天，向聊天记录redux中添加用户标记
        case 'ADD_CLIENT':
            state.ChatRecord[action.client] = []
            return {
                ...state
            };

        case 'ADD_MESSAGE':
            //若超过50条，删除最旧的一条消息
            if(state.ChatRecord[action.client].length>=InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
                state.ChatRecord[action.client].pop();
            }
            state.ChatRecord[action.client].unshift({status:'loading',message:action.message});
             //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
            state.ChatRecord[action.client] = state.ChatRecord[action.client].concat([]);
             return {
                ...state
            };
        case 'UPDATE_MESSAGES_STATUS':
            state.ChatRecord[action.client].forEach(function(itemArr,index,arr) {
                if(itemArr.message.MSGID === action.MSGID){
                    itemArr.status = action.status;
                }
            });
            //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
            state.ChatRecord[action.client] = state.ChatRecord[action.client].concat([]);
            return {
                ...state
            };

        case 'UPDATE_MESSAGES':
            state.ChatRecord[action.client].forEach(function(itemArr,index,arr) {
                if(itemArr.message.MSGID === action.MSGID){
                    itemArr.message = action.message;
                }
            });
            return {
                ...state
            };

        default:
            return state;
    }
}