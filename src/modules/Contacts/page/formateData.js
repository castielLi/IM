import HanZi_PinYin from './getFirestLetter';
export function initDataFormate(arr,filterStr) {
    let dataObj = {
        SectionArray: [],//返回Section所需数组格式
        KeyArray: [],//['A','B'...]
    };

    if (arr instanceof Array) {
        let SectionData = {};//{'A':{'wg003724':{...data},'wg003723':...}}
        arr.forEach((current, index) => {
            if ((current.Friend === true) && HanZi_PinYin.get(current.Remark != "" ? current.Remark : current.Nickname).indexOf(filterStr.toUpperCase()) >= 0) {
                let firstChat = HanZi_PinYin.get(current.Remark != "" ? current.Remark.slice(0, 1) : current.Nickname.slice(0, 1)).slice(0, 1);
                if (SectionData[firstChat] == null) {
                    SectionData[firstChat] = {};
                    SectionData[firstChat][current.Account] = current;
                    dataObj.KeyArray.push(firstChat);
                } else {
                    SectionData[firstChat][current.Account] = current;
                }
            }
        });
        for (let i in SectionData) {
            //小组信息对象
            let PieceObj = {};
            PieceObj['key'] = i;
            PieceObj['data'] = Object.values(SectionData[i]);
            dataObj.SectionArray.push(PieceObj);
        }
        return dataObj;
    }
}

export function initFlatListData(arr){
    return arr.filter((v,i)=>{
        return (v.Save === true || v.Save === 'true')
    })
}