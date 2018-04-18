/**
 * Created by apple on 2017/6/7.
 */
import { combineReducers } from 'redux';
import loginStore from '../../modules/Login/reducer';
import {unReadMessageStore,tabBarStore} from '../../modules/MainTabbar/reducer';
import {thouchBarStore,imageModalStore,chatDetailPageStore,mediaPlayerStore} from '../../modules/ChatDetail/reducer/index';
import FeaturesStore from '../../modules/Common/menu/reducer'
import NavigationBottomStore  from '../../modules/Common/NavigationBar/reducer/index'
import {unReadApplyMessageStore} from '../../modules/Contacts/reducer'
import selectRecordStore from '../../modules/ForwardChoose/reducer'

export default combineReducers({
	//登录状态
    loginStore,

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
    //选中的转发人
    selectRecordStore,

    //控制features显示隐藏
    FeaturesStore,
    //播放器状态
    mediaPlayerStore,
    //导航底部显示隐藏
    NavigationBottomStore,
    //未读好友申请显示隐藏
    unReadApplyMessageStore

});