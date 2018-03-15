/**
 * Created by apple on 2018/3/13.
 */
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
        this.systemManager = new SystemManager();
    }

    stateOpreation(appManagementObj) {

        SystemManager.initConfig(() => {
            this.systemManager.init(() => {
                appManagementObj.validateManager = ValidateManager.getSingleInstance();
                appManagementObj.validateManager.init(
                    appManagementObj.dispatchAppTokenState,
                    appManagementObj.dispatchMessageToMarkPage
                )
                appManagementObj.validateManager.validateToken();
                appManagementObj.setState(this)
            });
        });
    }
}

export class NoTokenState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.loginController = LoginController.getSingleInstance();
        appManagementObj.root.route.push(appManagementObj.root,{
            key:'Login',
            routeId: 'Login'
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

        //获取网络数据
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
        appManagementObj.setState(this)
    }
}

export class TokenValidateFailedState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.applyController.getUncheckApplyFriendCount();
        appManagementObj.setState(this)
    }
}


export class LogoutState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.ConnectState = false;
        appManagementObj.Logined = false;
        appManagementObj.loginController.destroyInstance();
        appManagementObj.imLogicController.destroyInstance();
        appManagementObj.userController.destroyInstance();
        appManagementObj.root.ToLogin();
        appManagementObj.setState(this);
    }

}

