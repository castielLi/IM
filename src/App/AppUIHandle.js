/**
 * Created by apple on 2018/1/4.
 */
import AppManagement from './AppManagement'
import {Alert} from 'react-native'
import Route from '../Core/route/router'
import AppPageMarkEnum from './AppPageMarkEnum'
import PageInitReadyEnum from './PageInitReadyEnum'

export function pageManagement(type,data){
    switch (type){
        case AppPageMarkEnum.AppKickOutHandle:
            Alert.alert(
                '下线通知',
                "该账号在其他设备上登录,请确认是本人操作并且确保账号安全!",
                [
                    {text: '确定', onPress: () => {
                        Route.ToLogin();
                    }},
                    {text: '不是本人操作',style:{color:"red"}, onPress: () => {
                        Route.ToLogin();
                    }},
                ]);
            break;
        default :
            if(type){
                AppManagement.dispatchMessageToMarkPage(type,data);
                break;
            }
    }
}