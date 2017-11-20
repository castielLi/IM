/**
 * Created by apple on 2017/6/7.
 */
import { combineReducers } from 'redux';
import loginStore from '../../modules/Login/reducer';
import chatRecordStore from '../../Core/Redux/chat/index';
import recentListStore from '../../Core/UserGroup/redux/index';
import {unReadMessageStore,tabBarStore} from '../../modules/MainTabbar/reducer';
import {thouchBarStore,imageModalStore,chatDetailPageStore,mediaPlayerStore} from '../../modules/ChatDetail/reducer/index';
import relationStore from '../../Core/Redux/contact';
import friendApplicationStore from '../../Core/Redux/applyFriend/index'
import FeaturesStore from '../../modules/Common/menu/reducer'
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
    //mainTabBar显示状态
    tabBarStore,
    //所有关系状态
    relationStore,
    //好友申请记录状态
    friendApplicationStore,
    //控制features显示隐藏
    FeaturesStore,
    //播放器状态
    mediaPlayerStore

});