/**
 * Created by apple on 2017/7/10.
 */
import {
    AsyncStorage,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as TYPES from './actionTypes';
import {clearChatRecord} from '../../../Core/Redux/chat/action';
import {clearRelation} from '../../../Core/Redux/contact/action';
import {clearRecentList} from '../../../Core/UserGroup/redux/action';
import {closeImDb} from '../../../Core/IM/StoreSqlite';
import {clearFriendApplication} from '../../../Core/Redux/applyFriend/action'
import {clearAllTabberMessageNumber,changeTabBar} from '../../MainTabbar/reducer/action';
import Route from '../../../Core/route/router';
import User from '../../../Core/UserGroup'
import IM from '../../../Core/IM'
let im = new IM();
let user = new User();
export function signIn(accountMessage){
    return {
        type: TYPES.LOGGED_IN,
        accountMessage
    };

}

export function signDoing(){
    return {
        type: TYPES.LOGGED_DOING,
    };

}

export function signOut(){
    return (dispatch,getState)=> {
        AsyncStorage.setItem('account', '');
        RNFS.moveFile('/data/data/com.im/databases/IM.db', '/data/data/com.im/files/' + getState().loginStore.accountMessage.accountId + '/database/IM.db');
        RNFS.moveFile('/data/data/com.im/databases/Account.db', '/data/data/com.im/files/' + getState().loginStore.accountMessage.accountId + '/database/Account.db');
        RNFS.moveFile('/data/data/com.im/databases/Group.db', '/data/data/com.im/files/' + getState().loginStore.accountMessage.accountId + '/database/Group.db');

        dispatch({type: TYPES.LOGGED_OUT});
        dispatch(clearChatRecord());
        dispatch(clearRelation());
        dispatch(clearFriendApplication())
        dispatch(clearRecentList());
        dispatch(clearAllTabberMessageNumber());
        dispatch(changeTabBar(0));
        closeImDb();
        user.closeDB();
        im.logout();
        Route.ToLogin();
    }
}

export function signError(){
    return {
        type: TYPES.LOGGED_ERROR,
    };

}