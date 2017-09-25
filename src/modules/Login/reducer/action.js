/**
 * Created by apple on 2017/7/10.
 */

import * as TYPES from './actionTypes'

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
    return {
        type: TYPES.LOGGED_OUT,
    };

}

export function signError(){
    return {
        type: TYPES.LOGGED_ERROR,
    };

}