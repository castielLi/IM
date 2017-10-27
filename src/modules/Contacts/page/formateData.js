import HanZi_PinYin from './getFirestLetter';
export function initDataFormate(type='private',arr){
    let snapArr = [];
    arr.forEach((v,i)=>{
        if(v.Type === type&&v.show==='true'){
            snapArr.push(v)
        }
    })

    let needArr = [];
    snapArr.forEach((value,index)=>{
        let firstLetter = HanZi_PinYin.get(value.Nick.slice(0,1)).slice(0,1);
        let exist = false;
        if(needArr.length === 0){
            needArr.push({'key':firstLetter,'data':[{'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email,localImage:value.LocalImage,owner:value.owner}]})
        }else{
            for(var i=0;i<needArr.length;i++){
                if(needArr[i]&&needArr[i].key===firstLetter){
                    needArr[i].data.push({'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email,localImage:value.LocalImage,owner:value.owner})
                    exist = true;
                }
            }
            if(exist === false){
                if(needArr[needArr.length-1].key<=firstLetter){
                    needArr.push({'key':firstLetter,'data':[{'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email,localImage:value.LocalImage,owner:value.owner}]})

                }else{
                    needArr.splice(needArr.length-2,0,{'key':firstLetter,'data':[{'Nick': value.Nick,'Type':value.Type,'avator':value.avator,RelationId:value.RelationId,OtherComment:value.OtherComment,Remark:value.Remark,BlackList:value.BlackList,Email:value.Email,localImage:value.LocalImage,owner:value.owner}]})
                }
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

export function initFlatListData(type,arr=[]){
    let needArr = [];
    arr.forEach((v,i)=>{
        if(v.Type === type){
            needArr.push(v)
        }
    })
    return needArr;
}