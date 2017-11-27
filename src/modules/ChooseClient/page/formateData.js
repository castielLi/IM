import HanZi_PinYin from './getFirestLetter';
export function initDataFormate(type='private',arr){

    let dataObj = {
        needArr : [],
        sectionArr : [],
    };
    let snapArr = [];
    arr.forEach((v,i)=>{
        if(v.Type === type&&(v.show === true || v.show === 'true')){
            snapArr.push(v)
        }

    })

    snapArr.forEach((value,index)=>{
        let firstLetter = HanZi_PinYin.get(value.Nick.slice(0,1)).slice(0,1);
        let exist = false;
        if(dataObj.needArr.length === 0){
            dataObj.needArr.push({'key':firstLetter,'data':[value]})
            dataObj.sectionArr.push(firstLetter);
        }else{
            for(var i=0;i<dataObj.needArr.length;i++){
                if(dataObj.needArr[i]&&dataObj.needArr[i].key===firstLetter){
                    dataObj.needArr[i].data.push(value)
                    exist = true;
                }
            }
            if(exist === false){
                dataObj.sectionArr.push(firstLetter);
                if(dataObj.needArr[dataObj.needArr.length-1].key<=firstLetter){
                    dataObj.needArr.push({'key':firstLetter,'data':[value]})

                }else{
                    dataObj.needArr.splice(dataObj.needArr.length-2,0,{'key':firstLetter,'data':[value]})
                }
            }
        }

    })

    return dataObj;
}

// export function initSection(arr=[]){
//     let needArr = [];
//     arr.forEach((v,i)=>{
//         needArr.push(v.key)
//     })
//     return needArr;
// }

export function initFlatListData(type,arr=[],filterStr){
    let needArr = [];
    arr.forEach((v,i)=>{
        if(v.Type === type&&(v.show === true || v.show === 'true')&&HanZi_PinYin.get(v.Nick).indexOf(filterStr.toUpperCase()) >= 0){
            needArr.push(v)
        }
    })
    return needArr;
}