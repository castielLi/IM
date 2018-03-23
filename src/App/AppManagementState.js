/**
 * Created by apple on 2018/3/13.
 */
import {Alert} from 'react-native'
import IAppManagementState from './interface/IAppManagementState'
//controller
import UserController from '../TSController/UserController'
import ApplyController from '../TSController/ApplyController'
import LoginController from '../TSController/LoginController'
import IMLogicController from '../TSController/IMLogic/IMControllerLogic'
import ValidateManager from '../TSController/ValidateManager'
import SystemManager from '../TSController/SystemManager'


export class InitState extends IAppManagementState{

    constructor(){
        super();
    }

    stateOpreation(appManagementObj) {

        SystemManager.initConfig(() => {
            SystemManager.init(() => {
                appManagementObj.validateManager = new ValidateManager();
                appManagementObj.validateManager.init(
                    appManagementObj.dispatchAppTokenState,
                    appManagementObj.dispatchMessageToMarkPage
                )
                appManagementObj.validateManager.validateToken();
                appManagementObj.setState(this)
            });
        },appManagementObj.uniqueId);
    }
}

export class NoTokenState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.loginController = new LoginController();
        appManagementObj.root.route.push(appManagementObj.root,{
            key:'Login',
            routeId: 'PhoneLogin'
        });
        appManagementObj.setState(this)
    }
}


export class WaitValidateTokenState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.imLogicController = IMLogicController.getSingleInstance();
        appManagementObj.userController = UserController.getSingleInstance();
        appManagementObj.applyController = ApplyController.getSingleInstance();
        appManagementObj.imLogicController.init(
            appManagementObj.dispatchMessageToMarkPage,
            appManagementObj.pageInitReady
        )
        appManagementObj.userController.init(
            appManagementObj.dispatchMessageToMarkPage,
            appManagementObj.pageInitReady
        )
        appManagementObj.applyController.init(
            appManagementObj.dispatchMessageToMarkPage,
        )
        appManagementObj.root.route.push(appManagementObj.root,{
            key:'MainTabbar',
            routeId: 'MainTabbar'
        });

        //初始化缓存数据
        appManagementObj.userController.getUserContactList(false, null);
        appManagementObj.setState(this)
    }
}

export class LoginedState extends IAppManagementState{
    stateOpreation(appManagementObj){

        appManagementObj.imLogicController = IMLogicController.getSingleInstance();
        appManagementObj.userController = UserController.getSingleInstance();
        appManagementObj.applyController = ApplyController.getSingleInstance();
        appManagementObj.imLogicController.init(
            appManagementObj.dispatchMessageToMarkPage,
            appManagementObj.pageInitReady
        )
        appManagementObj.userController.init(
            appManagementObj.dispatchMessageToMarkPage,
            appManagementObj.pageInitReady
        )
        appManagementObj.applyController.init(
            appManagementObj.dispatchMessageToMarkPage,
        )

        appManagementObj.root.route.push(appManagementObj.root,{
            key:'MainTabbar',
            routeId: 'MainTabbar'
        });
        appManagementObj.Logined = true;
        appManagementObj.systemLoginSuccess();

        //获取网络数据,这里需要先执行刷新缓存在执行界面跳转，因为界面中最近会话会用到user缓存
        appManagementObj.userController.getUserContactList(true, (result) => {
            appManagementObj.userController.getGroupContactList(true, (result) => {
            })
        })

        appManagementObj.applyController.getUncheckApplyFriendCount();

        appManagementObj.setState(this)
    }
}

export class TokenValidateSuccessState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.Logined = true;
        appManagementObj.systemLoginSuccess();
        //获取网络数据
        appManagementObj.userController.getUserContactList(true, (result) => {
            appManagementObj.userController.getGroupContactList(true, (result) => {
            })
        })

        appManagementObj.applyController.getUncheckApplyFriendCount();
        appManagementObj.validateManager = null;
        appManagementObj.setState(this)
    }
}

export class TokenValidateFailedState extends IAppManagementState{
    stateOpreation(appManagementObj){
        Alert.alert("错误","登录信息已经失效，请重新登录");
        appManagementObj.ConnectState = false;
        appManagementObj.Logined = false;
        appManagementObj.validateManager = null;
        if(appManagementObj.imLogicController != undefined){
            appManagementObj.imLogicController.destroyInstance();
        }
        if(appManagementObj.userController != undefined){
            appManagementObj.userController.destroyInstance();
        }
        if(appManagementObj.applyController != undefined){
            appManagementObj.applyController.destroyInstance();
        }
        appManagementObj.root.route.ToLogin();
        appManagementObj.setState(this)
    }
}


export class LogoutState extends IAppManagementState{
    stateOpreation(appManagementObj){
        if(appManagementObj.loginController == undefined){
            appManagementObj.loginController = new LoginController();
        }
        appManagementObj.loginController.logout();
        appManagementObj.ConnectState = false;
        appManagementObj.Logined = false;
        if(appManagementObj.imLogicController != undefined){
            appManagementObj.imLogicController.destroyInstance();
        }
        if(appManagementObj.userController != undefined){
            appManagementObj.userController.destroyInstance();
        }
        if(appManagementObj.applyController != undefined){
            appManagementObj.applyController.destroyInstance();
        }
        appManagementObj.root.route.ToLogin();
        appManagementObj.setState(this);
    }

}

