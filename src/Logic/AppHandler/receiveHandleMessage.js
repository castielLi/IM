/**
 * Created by apple on 2017/11/8.
 */

import Store from '../../store/index'
import * as ActionForLoginStore from '../../modules/Login/reducer/action'
import {Alert} from 'react-native'
let store = Store;

export function handleRecieveMessage(){

}

export function handleKickOutMessage(){
    Alert.alert(
        '下线通知',
        "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
        [
            {text: '确定', onPress: () => {
                store.dispatch(ActionForLoginStore.signOut());
            }},
            {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                store.dispatch(ActionForLoginStore.signOut());
            }},
        ]);
}
