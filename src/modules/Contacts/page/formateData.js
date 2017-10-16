import HanZi_PinYin from './getFirestLetter';
export function initDataFormate(arr){
    let needArr = [];
    arr.forEach((value,index)=>{
        let firstLetter = HanZi_PinYin.get(value.Nick).slice(0,1);
        let exist = false;
        if(needArr.length === 0){
            needArr.push({'key':firstLetter,'data':[{'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email}]})
        }else{
            for(var i=0;i<needArr.length;i++){
                if(needArr[i]&&needArr[i].key===firstLetter){
                    needArr[i].data.push({'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email})
                    exist = true;
                }
            }
            if(exist === false){
                needArr.push({'key':firstLetter,'data':[{'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email}]})
            }
        }

    })

    return needArr;
}

export function initSection(arr=[]){
    let needArr = [];
    arr.forEach((v,i)=>{
        needArr.push(v.key)
    })
    return needArr;
}