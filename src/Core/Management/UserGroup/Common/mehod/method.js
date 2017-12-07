import RelationModel from '../dto/RelationModel'


//controllerDto 转 managermentDto
export default function dtoChange(Obj){

    //todo：张彤 这个方法单独写到 usermanagement commom／method 里面

    let contactObj = new RelationModel();
    contactObj.OtherComment = Obj.OtherComment;
    contactObj.RelationId = Obj.RelationId;
    contactObj.Nick = Obj.Nick;
    contactObj.Remark = Obj.Remark;
    contactObj.BlackList = Obj.BlackList;
    contactObj.avator = Obj.avator;
    contactObj.Email = Obj.Email;
    contactObj.localImage = Obj.localImage;
    contactObj.Type = Obj.Type;
    contactObj.owner = Obj.owner;
    contactObj.show = Obj.show;
    return contactObj;
}