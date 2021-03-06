/**
 * Created by apple on 2017/6/7.
 */

import * as TYPES from './actionTypes';

const initialState = {
    isLoggedIn : false,
    accountMessage:{
        Account:"",
        Email:"",
        FamilyName:"",
        Gender:0,
        GivenName:"",
        HeadImageUrl:"",
        IMToken:"",
        Nickname:"",
        PhoneNumber: "",
        SessionToken:""
    }
};

export default function loginStore(state=initialState, action){

    switch(action.type){


        case TYPES.LOGGED_IN:
            return {
                ...state,
                isLoggedIn: true,
                accountMessage:action.accountMessage
            };

        case TYPES.LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false,
                accountMessage:initialState.accountMessage
            };
        case TYPES.LOGGED_ERROR:
            return {
                ...state,
                isLoggedIn: false,
                accountMessage:initialState.accountMessage
            }

        default:
            return state;
    }

}