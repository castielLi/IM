/**
 * Created by apple on 2017/7/10.
 */
import {
    AsyncStorage,
} from 'react-native';
import RNFS from 'react-native-fs';
import * as TYPES from './actionTypes';
import {clearAllTabberMessageNumber,changeTabBar} from '../../MainTabbar/reducer/action';


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
        RNFS.moveFile('/data/data/com.im/databases/Chat.db', '/data/data/com.im/files/' + getState().loginStore.accountMessage.accountId + '/database/Chat.db');

        dispatch({type: TYPES.LOGGED_OUT});

        dispatch(clearAllTabberMessageNumber());
        dispatch(changeTabBar(0));
    }
}

export function signError(){
    return {
        type: TYPES.LOGGED_ERROR,
    };

}