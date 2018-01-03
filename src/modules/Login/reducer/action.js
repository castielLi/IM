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