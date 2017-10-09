/**
 * Created by apple on 2017/6/7.
 */

/**
 * 所有 component 整个框架内只有此处引入
 * navigator 统一进行路由显示
 * 将全部 component 的引用从老式的层级式改为统一入口的扁平式
 */
/*
 * 路由配置项
 * 可配置默认参数 props: params
 */
import Login from './Login/page/main'
import PhoneLogin from './Login/page/phoneLogin'
import EmailLogin from './Login/page/emailLogin'
import Register from './Login/page/register'
import FindPassword from './Login/page/findPassword'
import ChangePassword from './Login/page/changePassword'
import MainTabbar from './MainTabbar/page/mainTabbar'
import ChatDetail from './ChatDetail/page'
import Camera from './Camera'
import Start from './Start/page'
import RecentList from './RecentList/page/recentChat'
import Contacts from './Contacts/page'
import Zoom from './Zoom/page'
import ClientInformation from './ClientInformation/page'
import InformationSetting from './InformationSetting/page'
import NewFriend from './NewFriend/page'

export const MainPage = {
    key: 'ChatDetail',
    routeId: 'ChatDetail'
}


export const InitialRoute = {
    key: 'Start',
    routeId: 'Start'
}

export const RouteMap = {
    'Root': {
        'Root': {
            component: ChatDetail,
            params: {}
        }
    },
    'Start': {
        'Start': {
            component: Start,
            params: {}
        }
    },
    'MainTabbar': {
        'MainTabbar':{
            component: MainTabbar,
            params: {}
        },
        'TabOne': {
            component: RecentList,
            params: {}
        },
        'TabTwo': {
            component: Contacts,
            params: {}
        },
        'TabThree': {
            component: Zoom,
            params: {}
        },
        'TabFour': {
            component: RecentList,
            params: {}
        }
    },
    'Login': {
        'Login': {
            component: Login,
            params: {}
        },
        'PhoneLogin':{
            component: PhoneLogin,
            params: {}
        },
        'EmailLogin':{
            component: EmailLogin,
            params: {}
        }
    },
    'Register':{
        'Register': {
            component: Register,
            params: {}
        }
    },
    'FindPassword':{
         'FindPassword': {
            component: FindPassword,
            params: {}
        }
    },
    'ChangePassword':{
         'ChangePassword': {
            component: ChangePassword,
            params: {}
        }
    },
    'ChatDetail': {
        'ChatDetail': {
            component: ChatDetail,
            params: {}
        }
    },'Camera': {
        'Camera': {
            component: Camera,
            params: {}
        }
    },'RecentList': {
        'RecentList': {
            component: RecentList,
            params: {}
        }
    },'Contacts': {
        'Contacts': {
            component: Contacts,
            params: {}
        }
    },'Zoom': {
        'Zoom': {
            component: Zoom,
            params: {}
        }
    },
    'ClientInformation': {
        'ClientInformation': {
            component: ClientInformation,
            params: {}
        }
    },
    'InformationSetting': {
        'InformationSetting': {
            component: InformationSetting,
            params: {}
        }
    },
    'NewFriend': {
        'NewFriend': {
            component: NewFriend,
            params: {}
        }
    },
};


// 'module/login': {component: Login, params: {}},
// 'module/maintabbar':{component:MainTabbar,params:{}},
// 'module/recode': {component: AudioExample, params: {}},
// 'module/xmpp': {component: Xmpp, params: {}},