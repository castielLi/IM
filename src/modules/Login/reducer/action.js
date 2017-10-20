/**
 * Created by apple on 2017/7/10.
 */
import {
    AsyncStorage,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as TYPES from './actionTypes';
import {clearChatRecord} from '../../../Core/IM/redux/action';
import {clearRelation} from '../../Contacts/reducer/action';
import {clearRecentList} from '../../RecentList/reducer/action';
import {closeImDb} from '../../../Core/IM/StoreSqlite';
import {closeAccountDb} from '../../../Core/User/StoreSqlite';
import {clearAllTabberMessageNumber} from '../../MainTabbar/reducer/action';
import Route from '../../../Core/route/router';
import IM from '../../../Core/IM'
let im = new IM();
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
        dispatch(clearRecentList());
        dispatch(clearAllTabberMessageNumber());
        closeImDb();
        closeAccountDb();
        im.logout();
        Route.ToLogin();
    }
}

export function signError(){
    return {
        type: TYPES.LOGGED_ERROR,
    };

}