/**
 * Created by apple on 2017/12/4.
 */


export addRelationEnum = {
    ADD_FRIEND : 'addFriend',
    CREATE_GROUP : 'createGroup',
    ADD_MEMBER : 'addMember',
}

export class addRelationDto{
    constructor(){
        this.relation = '';
        this.members = '';
        this.groupId = '';
    }
}
