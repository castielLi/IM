
import {addUnReadMessageNumber,cutUnReadMessageNumber} from '../../../modules/MainTabbar/reducer/action';
import IM from '../../IM/index';

let im = new IM();
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
//RecentList删除一个item ,index为数组索引
export function deleteRecentItemFromId(id){
    return {
        type: 'DELETE_RECENTITEM_FROM_ID',
        id
    };

}
//RecentList更新某个item  lastMessage为false表示只清空未读消息计数红点，而不修改LastMessagew文本  如果是接收消息而调用updateRecentItemLastMessage，则isReceiveMessage为true
export function updateRecentItemLastMessage(client,type,lastMessage,time,isReceiveMessage,NickAndHeadImageUrlObj){
    return (dispatch,getState)=>{
        let isAddUnReadMessage = false;//默认每次不添加未读消息
        //如果是接收到一条消息
        if(isReceiveMessage === true){
            //获取chatDetail状态
            let chatDetail = getState().chatDetailPageStore;

            if(!chatDetail.isChatDetailPageOpen || (chatDetail.isChatDetailPageOpen&&chatDetail.client!==client)){
                isAddUnReadMessage = true;//添加未读消息
                //更改unReadMessageStore状态
                let chatList = getState().recentListStore;
                existItem = false;
                let clientUnReadNumber = 0;
                let length = chatList.data.length;
                for(let i=0;i<chatList.data.length;i++){
                    if(chatList.data[i].Client === client){
                        clientUnReadNumber = chatList.data[i].unReadMessageCount;
                        existItem = true;
                        break;
                    }
                }
                //现在由controller控制
                // if(existItem){
                //     im.updateUnReadMessageNumber(client,clientUnReadNumber+1);
                // }else{
                //     im.updateUnReadMessageNumber(client,1);
                // }

                dispatch(addUnReadMessageNumber());


            }      
        }
        if(lastMessage === false){
            //更改unReadMessageStore状态
            let existItem = false;
            let recentList = getState().recentListStore.data;
            recentList.every((v,i)=>{
                if(v.Client === client){
                    //说明recentListStore存在对应的item
                    existItem = true;
                    im.updateUnReadMessageNumber(client,0);
                    dispatch(cutUnReadMessageNumber(v.unReadMessageCount));
                    //终止循环
                    return false;
                }
                return true;
            })
        }
        dispatch({
            type: 'UPDATE_RECENTITEM_LASTMESSAGE',
            Type:type,
            Client:client,
            LastMessage:lastMessage,
            Time:time,
            isAddUnReadMessage,
            NickAndHeadImageUrlObj
        });
    }

}


export function clearRecentList(){
    return {
        type: 'CLEAR_RECENTLIST',
    };

}