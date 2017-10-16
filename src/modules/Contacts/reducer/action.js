
import {initDataFormate} from '../page/formateData';

export function initFriendList(friendData){
    return {
        type: 'INIT_FRIENDLIST',
        friendData:initDataFormate(friendData)
    };

}

