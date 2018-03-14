/**
 * Created by apple on 2018/3/13.
 */
import * as AppHandles from './AppUIHandle'
import IAppManagementState from './interface/IAppManagementState'

//controller
import UserController from '../TSController/UserController'
import ApplyController from '../TSController/ApplyController'
import LoginController from '../TSController/LoginController'
import IMLogicController from '../TSController/IMLogic/IMControllerLogic'

export class LoginningState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.userController = UserController.getSingleInstance();
        appManagementObj.applyController = ApplyController.getSingleInstance();
        appManagementObj.loginController = LoginController.getSingleInstance();
        appManagementObj.userController.init(
            AppHandles.pageManagement,
            AppHandles.pageReadyManagement
        )

        appManagementObj.applyController.init(
            AppHandles.pageManagement,
        )

        appManagementObj.setState(this)
    }
}

export class TokenLoginState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.imLogicController = IMLogicController.getSingleInstance();
        appManagementObj.imLogicController.init(
            AppHandles.pageManagement,
            AppHandles.pageReadyManagement
        )
        appManagementObj.setState(this)
    }
}


export class LoginnedState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.Logined = true;
        appManagementObj.imLogicController = IMLogicController.getSingleInstance();
        appManagementObj.imLogicController.init(
            AppHandles.pageManagement,
            AppHandles.pageReadyManagement
        )
        appManagementObj.systemLogined();
        appManagementObj.setState(this)
    }
}

export class TokenLoginnedState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.Logined = true;
        appManagementObj.systemLogined();
        appManagementObj.setState(this)
    }
}


export class LogoutState extends IAppManagementState{
    stateOpreation(appManagementObj){
        appManagementObj.ConnectState = false;
        appManagementObj.Logined = false;
        appManagementObj.setState(this);
        appManagementObj.loginController.destroyInstance();
        appManagementObj.imLogicController.destroyInstance();
        appManagementObj.userController.destroyInstance();
    }

}