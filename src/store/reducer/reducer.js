/**
 * Created by apple on 2017/6/7.
 */
import { combineReducers } from 'redux';
import loginStore from '../../modules/Login/reducer';
import chatRecordStore from '../../Core/IM/redux/index';
import recentListStore from '../../modules/RecentList/reducer';
import unReadMessageStore from '../../modules/MainTabbar/reducer';
import {thouchBarStore,imageModalStore,chatDetailPageStore} from '../../modules/ChatDetail/reducer/index';
import contactsStore from '../../modules/Contacts/reducer';
import relationStore from '../../Core/User/redux';
export default combineReducers({
	//登录状态
    loginStore,
    //最新聊天记录状态
    chatRecordStore,
    //最近聊天列表状态
    recentListStore,
    //聊天栏状态
    thouchBarStore,
    //大图展示状态
    imageModalStore,
    //聊天页面状态
    chatDetailPageStore,
    //未读消息状态
    unReadMessageStore,
    //联系人状态
    contactsStore,
    //所以关系状态
    relationStore
});