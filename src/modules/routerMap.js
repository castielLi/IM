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
import Mark from '../App/Enum/AppPageMarkEnum'
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
import ChooseClientt from './ChooseClient/page/index2'
import GroupInformationSetting from './GroupInformationSetting/page'
import MoreGroupList from './GroupInformationSetting/page/MoreGroupList'
import GroupAnnouncement from './GroupInformationSetting/page/GroupAnnouncement'
import GroupName from './GroupInformationSetting/page/GroupName'
import DeleteGroupMember from './GroupInformationSetting/page/DeleteGroupMember'
import Player from './ChatDetail/page/List/player'
import Gallery from './ChatDetail/page/List/gallery'
import ForwardChoose from './ForwardChoose/page/ForwardChoose'
import ContactsChoose from './ForwardChoose/page/ContactsChoose'
import GroupsChoose from './ForwardChoose/page/GroupsChoose'
import Profile from './Profile/page'
import HeadImage from './Profile/page/HeadImage'
import NickName from './Profile/page/Nickname'
import SelectGroup from './ChooseClient/page/SelectGroup'
import RemarkInfo from './ClientInformation/page/RemarkInfo'
import QRCodeContent from './Profile/page/QRCode'
import ScanCode from './ScanCode/page'
import MoreSetting from './Profile/page/More'
import Signature from './Profile/page/More/Signature'
import ScanUnknow from './ScanCode/page/ScanUnknowPage'
import Gender from './Profile/page/More/RadioCollection'
import GroupQRCodeContent from './GroupInformationSetting/page/QRCode'
import GroupBackgroundImage from './GroupInformationSetting/page/BackgroundImage'
import PrivateChatBackgroundImage from './ChatSetting/page/BackgroundImage'


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
            params: {"name":"Root"}
        }
    },
    'Start': {
        'Start': {
            component: Start,
            params: {"name":"Start"}
        }
    },
    'MainTabbar': {
        'MainTabbar':{
            component: MainTabbar,
            params: {"name":"MainTabbar"},
            markType:Mark.UnReadMessage
        },
        'TabOne': {
            component: RecentList,
            params: {"name":"RecentList"},
            markType:[Mark.ConversationList,Mark.AppStatus]
        },
        'TabTwo': {
            component: Contacts,
            params: {"name":"Contacts"},
            markType:[Mark.Contacts,Mark.UnReadMessage,Mark.ChangeRemark]
        },
        'TabThree': {
            component: Zoom,
            params: {"name":"Zoom"}
        },
        'TabFour': {
            component: Me,
            params: {"name":"Me"},
            markType:[Mark.ChangeNickname,Mark.ChangeHeadImage]
        }
    },
    'Login': {
        'Login': {
            component: Login,
            params: {"name":"Login"}
        },
        'PhoneLogin':{
            component: PhoneLogin,
            params: {"name":"PhoneLogin"},
            markType:Mark.ConversationDetail
        },
        'EmailLogin':{
            component: EmailLogin,
            params: {"name":"EmailLogin"}
        }
    },
    'Register':{
        'Register': {
            component: Register,
            params: {"name":"Register"}
        }
    },
    'FindPassword':{
         'FindPassword': {
            component: FindPassword,
            params: {"name":"FindPassword"}
        }
    },
    'ChangePassword':{
         'ChangePassword': {
            component: ChangePassword,
            params: {"name":"ChangePassword"}
        }
    },
    'ChatDetail': {
        'ChatDetail': {
            component: ChatDetail,
            params: {"name":"ChatDetail"},
            markType:[Mark.ConversationDetail,Mark.ModifyGroupName,Mark.ModifyGroupSetting,Mark.ConversationDetailBackgroundImage]
        }
    },
    'RecentList': {
        'RecentList': {
            component: RecentList,
            params: {"name":"RecentList"},
            markType:Mark.ConversationList
        }
    },
    'Contacts': {
        'Contacts': {
            component: Contacts,
            params: {"name":"Contacts"},
            markType:[Mark.Contacts,Mark.UnReadMessage]
        },
        'GroupList':{
            component:GroupList,
            params:{"name":"GroupList"}
        }
    },
    'Zoom': {
        'Zoom': {
            component: Zoom,
            params: {"name":"Zoom"}
        }
    },
    'AddFriends':{
        'AddFriends':{
            component: AddFriends,
            params: {"name":"AddFriends"}
        }
    },
    'ClientInformation': {
        'ClientInformation': {
            component: ClientInformation,
            params: {"name":"ClientInformation"},
            markType: Mark.ChangeRemark
        }
    },
    'InformationSetting': {
        'InformationSetting': {
            component: InformationSetting,
            params: {"name":"InformationSetting"}
        }
    },
    'NewFriend': {
        'NewFriend': {
            component: NewFriend,
            params: {"name":"NewFriend"},
            markType:Mark.ApplyMessage
        }
    },
    'SearchNewFriend': {
        'SearchNewFriend': {
            component: SearchNewFriend,
            params: {"name":"SearchNewFriend"}
        }
    },
    'ChatSetting': {
        'ChatSetting': {
            component: ChatSetting,
            params: {"name":"ChatSetting"}
        },
        'PrivateChatBackgroundImage':{
            component:PrivateChatBackgroundImage,
            params:{}
        }
    },
    'Me': {
        'Me': {
            component: Me,
            params: {"name":"Me"}
        }
    },
    'Validate': {
        'Validate': {
            component: Validate,
            params: {"name":"Validate"}
        }
    },
    'ChooseClient': {
        'ChooseClient': {
            component: ChooseClient,
            params: {"name":"ChooseClient"}
        }
    },
    'ChooseClientt': {
        'ChooseClientt': {
            component: ChooseClientt,
            params: {"name":"ChooseClientt"}
        }
    },
    'GroupInformationSetting': {
        'GroupInformationSetting': {
            component: GroupInformationSetting,
            params: {"name":"GroupInformationSetting"},
            markType:Mark.ChangeRemark
        },
        "GroupQRCodeContent":{
            component:GroupQRCodeContent,
            params:{}
        },
        'GroupBackgroundImage':{
            component:GroupBackgroundImage,
            params:{}
        }
    },
    'MoreGroupList': {
        'MoreGroupList': {
            component: MoreGroupList,
            params: {"name":"MoreGroupList"}
        }
    },
    'GroupAnnouncement': {
        'GroupAnnouncement': {
            component: GroupAnnouncement,
            params: {"name":"GroupAnnouncement"}
        }
    },
    'GroupName': {
        'GroupName': {
            component: GroupName,
            params: {"name":"GroupName"}
        }
    },
    'DeleteGroupMember': {
        'DeleteGroupMember': {
            component: DeleteGroupMember,
            params: {"name":"DeleteGroupMember"}
        }
    },
    'Player' : {
        'Player' : {
            component: Player,
            params: {"name":"Player"}
        }
    },
    'Gallery' : {
        'Gallery' : {
        component: Gallery,
            params: {"name":"Gallery"}
        }
    },
    'ForwardChoose':{
        'ForwardChoose': {
            component: ForwardChoose,
            params: {"name":"ForwardChoose"},
            markType:Mark.ConversationList
        }
    },
    'ContactsChoose':{
        'ContactsChoose': {
            component: ContactsChoose,
            params: {"name":"ContactsChoose"}
        }
    },
    'GroupsChoose':{
        'GroupsChoose': {
            component: GroupsChoose,
            params: {"name":"GroupsChoose"}
        }
    },
    'Profile':{
        'Profile': {
            component: Profile,
            params: {"name":"Profile"},
            markType:[Mark.ChangeHeadImage,Mark.ChangeNickname]
        },
        'HeadImage':{
            component: HeadImage,
            params:{"name":"HeadImage"},
            markType:Mark.ChangeHeadImage
        },
        'NickName':{
            component:NickName,
            params:{"name":"NickName"}
        },
        'QRCode': {
            component: QRCodeContent,
            params: {"name":"QRCode"}
        },
        'MoreSetting':{
            component: MoreSetting,
            params: {"name":"MoreSetting"}
        },
        'Signature':{
            component: Signature,
            params: {"name":"Signature"}
        },
        'GenderChange':{
            component:Gender,
            params:{}
        }

    },
    'SelectGroup':{
        'SelectGroup': {
            component: SelectGroup,
            params: {"name":"SelectGroup"}
        }
    },
    'RemarkInfo':{
        'RemarkInfo': {
            component: RemarkInfo,
            params: {"name":"RemarkInfo"}
        }
    },
    'ScanCode':{
        'ScanCode': {
            component: ScanCode,
            params: {"name":"ScanCode"}
        },
        'ScanUnknow':{
            component:ScanUnknow,
            params:{}
        }
    }

};


// 'module/login': {component: Login, params: {}},
// 'module/maintabbar':{component:MainTabbar,params:{}},
// 'module/recode': {component: AudioExample, params: {}},
// 'module/xmpp': {component: Xmpp, params: {}},