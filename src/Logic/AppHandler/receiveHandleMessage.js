/**
 * Created by apple on 2017/11/8.
 */

import Store from '../../store/index'
import * as ActionForLoginStore from '../../modules/Login/reducer/action'
import {changeUnReadMessageNumber,changeUnDealRequestNumber} from '../../../src/modules/MainTabbar/reducer/action';
import TabTypeEnum from '../Im/dto/TabTypeEnum'
import {Alert} from 'react-native'
let store = Store;

export function handleRecieveMessage(count,type = TabTypeEnum.RecentList){
    switch (type){
        case TabTypeEnum.RecentList:
            store.dispatch(changeUnReadMessageNumber(count))
            break;
        case TabTypeEnum.Contact:
            store.dispatch(changeUnDealRequestNumber(count))
    }
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
