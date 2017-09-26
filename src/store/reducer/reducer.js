/**
 * Created by apple on 2017/6/7.
 */
import { combineReducers } from 'redux';
import loginStore from '../../modules/Login/reducer';
import chatRecordStore from '../../Core/IM/redux/index';
import recentListStore from '../../modules/RecentList/reducer';
import {thouchBarStore,imageModalStore} from '../../modules/ChatDetail/reducer/index';
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

});