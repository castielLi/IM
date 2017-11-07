/**
 * Created by apple on 2017/7/10.
 */
import {
    AsyncStorage,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as TYPES from './actionTypes';
import {clearChatRecord} from '../../../Core/IM/redux/chat/action';
import {clearRelation} from '../../Contacts/reducer/action';
import {clearRecentList} from '../../../Core/User/redux/action';
import {closeImDb} from '../../../Core/IM/StoreSqlite';
import {clearFriendApplication} from '../../../Core/IM/redux/applyFriend/action'
import {clearAllTabberMessageNumber} from '../../MainTabbar/reducer/action';
import Route from '../../../Core/route/router';
import User from '../../../Core/User'
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
        dispatch({type: TYPES.LOGGED_OUT});
        dispatch(clearChatRecord());
        dispatch(clearRelation());
        dispatch(clearFriendApplication())
        dispatch(clearRecentList());
        dispatch(clearAllTabberMessageNumber());

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