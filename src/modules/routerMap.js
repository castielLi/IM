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
import Mark from '../App/AppPageMarkEnum'
import Root from './Root/root'
import Login from './Login/page/main'
import PhoneLogin from './Login/page/phoneLogin'
import EmailLogin from './Login/page/emailLogin'
import Register from './Login/page/register'
import FindPassword from './Login/page/findPassword'
import ChangePassword from './Login/page/changePassword'
import MainTabbar from './MainTabbar/page/mainTabbar'
import ChatDetail from './ChatDetail/page'
import Start from './Start/page'
import RecentList from './RecentList/page/recentChat'
import Contacts from './Contacts/page'
import Zoom from './Zoom/page'
import AddFriends from './AddFriends'
import ClientInformation from './ClientInformation/page'
import InformationSetting from './InformationSetting/page'
import NewFriend from './NewFriend/page'
import SearchNewFriend from './SearchNewFriend/page'
import ChatSetting from './ChatSetting/page'
import Me from './Me/page'
import GroupList from './Contacts/page/GroupList'

import Validate from './AddFriends/validate'
import ChooseClient from './ChooseClient/page'
import GroupInformationSetting from './GroupInformationSetting/page'
import MoreGroupList from './GroupInformationSetting/page/MoreGroupList'
import GroupAnnouncement from './GroupInformationSetting/page/GroupAnnouncement'
import GroupName from './GroupInformationSetting/page/GroupName'
import DeleteGroupMember from './GroupInformationSetting/page/DeleteGroupMember'
import Player from './ChatDetail/page/List/player'
import Gallery from './ChatDetail/page/List/gallery'

export const MainPage = {
    key: 'MainTabbar',
    routeId: 'MainTabbar'
}

export const InitialRoute = {
    key: 'Start',
    routeId: 'Start'
}

export const RootRoute = {
    key : 'Root',
    routeId : 'Root'
}

export const LoginRoute = {
    key: 'Login',
    routeId: 'Login'
}

export const RouteMap = {
    'Root': {
        'Root': {
            component: Root,
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
            params: {},
            markType:Mark.UnReadMessage
        },
        'TabOne': {
            component: RecentList,
            params: {},
            markType:Mark.ConversationList
        },
        'TabTwo': {
            component: Contacts,
            params: {},
            markType:[Mark.Contacts,Mark.UnReadMessage]
        },
        'TabThree': {
            component: Zoom,
            params: {}
        },
        'TabFour': {
            component: Me,
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
            params: {},
            markType:Mark.ConversationDetail
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
            params: {},
            markType:Mark.ConversationDetail
        }
    },
    'RecentList': {
        'RecentList': {
            component: RecentList,
            params: {},
            markType:Mark.ConversationList
        }
    },
    'Contacts': {
        'Contacts': {
            component: Contacts,
            params: {}
        },
        'GroupList':{
            component:GroupList,
            params:{}
        }
    },
    'Zoom': {
        'Zoom': {
            component: Zoom,
            params: {}
        }
    },
    'AddFriends':{
        'AddFriends':{
            component: AddFriends,
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
            params: {},
            markType:Mark.ApplyMessage
        }
    },
    'SearchNewFriend': {
        'SearchNewFriend': {
            component: SearchNewFriend,
            params: {}
        }
    },
    'ChatSetting': {
        'ChatSetting': {
            component: ChatSetting,
            params: {}
        }
    },
    'Me': {
        'Me': {
            component: Me,
            params: {}
        }
    },
    'Validate': {
        'Validate': {
            component: Validate,
            params: {}
        }
    },
    'ChooseClient': {
        'ChooseClient': {
            component: ChooseClient,
            params: {}
        }
    },
    'GroupInformationSetting': {
        'GroupInformationSetting': {
            component: GroupInformationSetting,
            params: {}
        }
    },
    'MoreGroupList': {
        'MoreGroupList': {
            component: MoreGroupList,
            params: {}
        }
    },
    'GroupAnnouncement': {
        'GroupAnnouncement': {
            component: GroupAnnouncement,
            params: {}
        }
    },
    'GroupName': {
        'GroupName': {
            component: GroupName,
            params: {}
        }
    },
    'DeleteGroupMember': {
        'DeleteGroupMember': {
            component: DeleteGroupMember,
            params: {}
        }
    },
    'Player' : {
        'Player' : {
            component: Player,
            params: {}
        }
    },
    'Gallery' : {
        'Gallery' : {
        component: Gallery,
            params: {}
        }
    },
};


// 'module/login': {component: Login, params: {}},
// 'module/maintabbar':{component:MainTabbar,params:{}},
// 'module/recode': {component: AudioExample, params: {}},
// 'module/xmpp': {component: Xmpp, params: {}},