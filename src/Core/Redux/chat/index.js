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
//                             Time:'',//资源时间
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
import MessageStatus from '../../IM/dto/MessageStatus';

const initialState = {
    ChatRecord: {}
}
export default function chatRecordStore(state = initialState, action) {
    switch (action.type) {
        case 'INIT_CHATRECORD':
            if(state.ChatRecord[action.client]===undefined){
                state.ChatRecord[action.client] = [];

            }
            state.ChatRecord[action.client] = state.ChatRecord[action.client].concat(action.messageList);
            return{
                ...state,
            }
        //第一次聊天，向聊天记录redux中添加用户标记
        case 'ADD_CLIENT':
            state.ChatRecord[action.client] = []
            return {
                ...state
            };

        case 'ADD_MESSAGE':
                //若超过50条，删除最旧的一条消息
                if(state.ChatRecord[action.client]===undefined){
                    state.ChatRecord[action.client] = [];

                }
                if(state.ChatRecord[action.client].length>=InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
                    state.ChatRecord[action.client].pop();
                }
                state.ChatRecord[action.client].unshift({status:'WaitOpreator',message:action.message});
                 //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
                state.ChatRecord[action.client] = state.ChatRecord[action.client].concat([]);
                 return {
                    ...state,
                };

        
        case 'RECEIVE_MESSAGE':
            //若超过50条，删除最旧的一条消息
            if(state.ChatRecord[action.client]===undefined){
                state.ChatRecord[action.client] = [];
            }

                if(state.ChatRecord[action.client].length>=InitChatRecordConfig.INIT_CHAT_REDUX_NUMBER){
                    state.ChatRecord[action.client].pop();
                }
                state.ChatRecord[action.client].unshift({status:'WaitOpreator',message:action.message});
                 //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
                state.ChatRecord[action.client] = state.ChatRecord[action.client].concat([]);
                 return {
                    ...state
                };

             
        case 'UPDATE_MESSAGES_STATUS':
            if(state.ChatRecord[action.client]===undefined){
                state.ChatRecord[action.client] = []
            }
                state.ChatRecord[action.client].forEach(function(itemArr,index,arr) {
                    if(itemArr.message.MSGID === action.MSGID){
                        itemArr.status = action.status ? MessageStatus.SendSuccess : MessageStatus.SendFailed;
                    }
                });
                //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
                state.ChatRecord[action.client] = state.ChatRecord[action.client].concat([]);
                return {
                    ...state
                };



        case 'UPDATE_MESSAGES':
            if(state.ChatRecord[action.client]===undefined){
                state.ChatRecord[action.client] = []
            }
                state.ChatRecord[action.client].forEach(function(itemArr,index,arr) {
                    if(itemArr.message.MSGID === action.MSGID){
                        itemArr.message = action.message;
                    }
                });
                return {
                    ...state
                };

        case 'UPDATE_MESSAGES_PATH':
            if(state.ChatRecord[action.sender]===undefined){
                state.ChatRecord[action.sender] = []
            }
            let PATHState = JSON.parse(JSON.stringify(state));
            PATHState.ChatRecord[action.sender].forEach(function (itemArr,index,arr) {
                if(itemArr.message.MSGID === action.MSGID){
                    itemArr.message.Resource[0].LocalSource = action.path;
                }
            });
            return PATHState;
            // state.ChatRecord[action.sender].forEach(function(itemArr,index,arr) {
            //     if(itemArr.message.MSGID === action.MSGID){
            //         itemArr.message.Resource[0].LocalSource = action.path;
            //     }
            // });
            // //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
            // state.ChatRecord[action.sender] = state.ChatRecord[action.sender].concat([]);
            // return {
            //     ...state
            // };

        case 'UPDATE_MESSAGES_URL':
            if(state.ChatRecord[action.sender]===undefined){
                state.ChatRecord[action.sender] = []
            }
            let URLState = JSON.parse(JSON.stringify(state));
            URLState.ChatRecord[action.sender].forEach(function (itemArr,index,arr) {
                if(itemArr.message.MSGID === action.MSGID){
                    itemArr.message.Resource[0].RemoteSource = action.url;
                }
            });
            return URLState;
            // state.ChatRecord[action.sender].forEach(function(itemArr,index,arr) {
            //     if(itemArr.message.MSGID === action.MSGID){
            //         itemArr.message.Resource[0] = {...itemArr.message.Resource[0]};
            //         itemArr.message.Resource[0].RemoteSource = action.url;
            //
            //     }
            // });
            // //聊天内容页面需要刷新，实现某用户聊天数组的深拷贝，改变聊天数组的引用
            // state.ChatRecord[action.sender] = state.ChatRecord[action.sender].concat([]);
            // return {
            //     ...state,
            //     message:{
            //         Resource:[
            //             {...itemArr.message.Resource[0]}
            //         ]
            //     }
            // };

        case 'HANDLE_CHATRECORD':
            let ChatRecord = state.ChatRecord[action.client];
            let length = InitChatRecordConfig.INIT_CHAT_RECORD_NUMBER;
            if(ChatRecord.length > length){
                state.ChatRecord[action.client] = state.ChatRecord[action.client].slice(0,length);
                return {
                    ...state
                }
            }
            return state;
        case 'CLEAR_CHATRECORD_FROM_ID':
            if(state.ChatRecord[action.client]===undefined){
                state.ChatRecord[action.client] = [];

            }
            state.ChatRecord[action.client] = [];
            return{
                ...state,
            }
        //注销清空store
        case 'CLEAR_CHATRECORD':
            return {
                ...initialState
            };
        default:
            return state;
    }
}