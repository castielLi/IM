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