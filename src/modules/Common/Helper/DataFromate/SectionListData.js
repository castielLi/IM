import HanZi_PinYin from '../TextHelper/FirstCharacter';
export function SectionDataFormate(Data,filterStr = ''){
    let ResultObj = {
        SectionArray : [],//返回Section所需数组格式
        KeyArray : [],//['A','B'...]
    };
    if(Data instanceof Array){
        let SectionData = {};//{'A':{'wg003724':{...data},'wg003723':...}}
        Data.forEach((current,index)=>{
            if((current.Friend === true)&&HanZi_PinYin.get(current.Nickname).indexOf(filterStr.toUpperCase()) >= 0){
                let firstChat = HanZi_PinYin.get(current.Nickname.slice(0,1)).slice(0,1);
                if(SectionData[firstChat] == null){
                    SectionData[firstChat] = {};
                    SectionData[firstChat][current.Account] = current;
                    ResultObj.KeyArray.push(firstChat);
                    // dataObj.sectionArr.push(firstChat);
                }else{
                    SectionData[firstChat][current.Account] = current;
                }
            }
        });
        for(let i in SectionData){
            //小组信息对象
            let PieceObj = {};
            PieceObj['key'] = i;
            PieceObj['data'] = Object.values(SectionData[i]);
            ResultObj.SectionArray.push(PieceObj);
        }
        return ResultObj;
    }
}